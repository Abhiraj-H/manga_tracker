import { MangaCard } from "@/components/shared/manga-card"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

const TABS = ["All", "Reading", "Completed", "Plan to Read", "On Hold", "Dropped"]

export const dynamic = 'force-dynamic';

export default async function LibraryPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const resolvedParams = await searchParams;
  const currentStatus = resolvedParams?.status || "All";

  // Fetch library entries for this user (RLS ensures only their rows)
  const { data: allEntries = [], error } = await supabase
    .from("library_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Library fetch error:", error)
  }

  const entriesToDisplay = currentStatus === "All"
    ? (allEntries ?? [])
    : (allEntries ?? []).filter((e: any) => e.status === currentStatus)

  const STATUS_TABS = TABS.map(tab => ({
    tab,
    count: tab === "All" ? (allEntries?.length ?? 0) : (allEntries ?? []).filter((m: any) => m.status === tab).length
  }));
  const activeTab = currentStatus;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 animate-in fade-in duration-700">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="w-full">
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">My Library</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your manga reading progress.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search library..." 
              className="w-full bg-muted/40 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all font-medium"
            />
          </div>
          <button className="p-2.5 bg-muted/40 border border-border rounded-xl hover:bg-accent transition-colors text-muted-foreground">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2.5 bg-muted/40 border border-border rounded-xl hover:bg-accent transition-colors text-muted-foreground">
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth">
        {STATUS_TABS.map(({ tab, count }) => {
          const isActive = activeTab === tab
          return (
            <a
              key={tab}
              href={`/library?status=${encodeURIComponent(tab)}`}
              className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
            >
              {tab}
              <span className={`ml-2 px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                 {count}
              </span>
            </a>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-4">
        {entriesToDisplay.map((manga: any) => (
          <div key={manga.id}>
            <MangaCard 
              id={manga.manga_id} 
              title={manga.title} 
              coverImage={manga.cover_image} 
              status={manga.status === "Reading" ? "NEW" : undefined}
            />
            <div className="mt-3">
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                    style={{ width: manga.status === 'Completed' ? '100%' : `${manga.total ? (manga.progress / manga.total) * 100 : Math.min(manga.progress * 2, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs font-bold text-muted-foreground">{manga.status}</p>
                  <p className="text-xs font-bold text-foreground">{manga.progress} / {manga.total || '?'}</p>
                </div>
            </div>
          </div>
        ))}
      </div>
      
      {entriesToDisplay.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-zinc-500 font-medium">No manga found for this filter.</p>
          </div>
      )}

    </div>
  )
}
