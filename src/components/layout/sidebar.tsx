"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Library, LineChart, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Discover", href: "/discover", icon: Compass },
  { name: "Library", href: "/library", icon: Library },
  { name: "Analytics", href: "/analytics", icon: LineChart },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 h-screen w-64 glass border-r border-border bg-background/50 hidden md:flex flex-col z-50">
      <div className="p-6">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-primary to-accent-500 tracking-tighter">
          ChapterOne
        </h1>
      </div>
      
      <div className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-primary/10 text-primary font-bold shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.name}
            </Link>
          )
        })}
      </div>
      
      <div className="p-4 mb-4 mt-auto">
        <div className="glass-panel p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-accent/50 transition-all border border-border">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-primary/20 transition-all">
               ME
             </div>
             <div>
               <p className="text-sm font-bold text-foreground">Ash</p>
               <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">Free Tier</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
