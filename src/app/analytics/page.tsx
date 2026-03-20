import { BookOpen, TrendingUp, Clock, CalendarDays, Award } from "lucide-react"
import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { AnalyticsCharts } from "./components/charts"

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch library entries for this user
  const { data: entries = [] } = await supabase
    .from("library_entries")
    .select("*")
    .eq("user_id", user.id)

  const allEntries = entries ?? []

  // Calculate Real Stats
  const totalChapters = allEntries.reduce((acc: number, e: any) => acc + (e.progress ?? 0), 0)
  const completedManga = allEntries.filter((e: any) => e.status === "Completed").length
  
  // Approximate time (mock formula: 5 mins per chapter)
  const daysSpent = Math.floor((totalChapters * 5) / (24 * 60))
  const hoursSpent = Math.floor(((totalChapters * 5) % (24 * 60)) / 60)

  // Current streak is mocked since creating daily logs requires a separate robust table
  const currentStreak = allEntries.length > 0 ? 1 : 0
  
  const ACTIVITY_DATA = [
     { month: 'Jan', chapters: 0 },
     { month: 'Feb', chapters: 0 },
     { month: 'Mar', chapters: totalChapters },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 pb-24">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter flex items-center gap-3">
          <Award className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          Reading Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Your reading habits and statistics for this year.</p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-primary hover:-translate-y-1 transition-transform duration-300">
           <div className="flex items-center gap-4 text-primary mb-2">
             <BookOpen className="w-5 h-5" />
             <h3 className="font-bold text-sm">Total Chapters</h3>
           </div>
           <p className="text-3xl md:text-4xl font-black text-foreground">{totalChapters.toLocaleString()}</p>
           <p className="text-xs text-muted-foreground mt-1">Total reads recorded</p>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-accent-500 hover:-translate-y-1 transition-transform duration-300">
           <div className="flex items-center gap-4 text-accent-500 mb-2">
             <Clock className="w-5 h-5" />
             <h3 className="font-bold text-sm">Time Spent</h3>
           </div>
           <p className="text-3xl md:text-4xl font-black text-foreground">{daysSpent}<span className="text-lg">d</span> {hoursSpent}<span className="text-lg">h</span></p>
           <p className="text-xs text-muted-foreground mt-1">Est. 5m per chapter</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-indigo-500 hover:-translate-y-1 transition-transform duration-300">
           <div className="flex items-center gap-4 text-indigo-500 mb-2">
             <TrendingUp className="w-5 h-5" />
             <h3 className="font-bold text-sm">Curr. Streak</h3>
           </div>
           <p className="text-3xl md:text-4xl font-black text-foreground">{currentStreak} <span className="text-lg">Days</span></p>
           <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-orange-500 hover:-translate-y-1 transition-transform duration-300">
           <div className="flex items-center gap-4 text-orange-400 mb-2">
             <CalendarDays className="w-5 h-5" />
             <h3 className="font-bold text-sm">Manga Completed</h3>
           </div>
           <p className="text-3xl md:text-4xl font-black text-foreground">{completedManga}</p>
           <p className="text-xs text-muted-foreground mt-1">This Year</p>
        </div>
      </div>

      {allEntries.length === 0 ? (
        <div className="py-24 text-center glass-panel rounded-2xl">
           <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
           <p className="text-zinc-400">Add manga to your library and log chapter progress to unlock analytics charts.</p>
        </div>
      ) : (
        <AnalyticsCharts activityData={ACTIVITY_DATA} />
      )}

    </div>
  )
}
