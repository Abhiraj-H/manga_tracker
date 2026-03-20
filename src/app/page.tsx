import { MangaCard } from "@/components/shared/manga-card"
import { Play, Plus, ChevronRight, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { anilistClient, TRENDING_MANGA_QUERY, POPULAR_MANGA_QUERY } from "@/lib/api/anilist"

export const revalidate = 3600 // Cache for 1 hour

export default async function Home() {
  
  // Fetch from AniList API
  const [trendingRes, popularRes] = await Promise.all([
    anilistClient.request<any>(TRENDING_MANGA_QUERY, { page: 1, perPage: 15 }),
    anilistClient.request<any>(POPULAR_MANGA_QUERY, { page: 1, perPage: 10 }),
  ])
  
  const trendingData = trendingRes.Page.media
  const popularData = popularRes.Page.media
  
  // Set hero to the #1 trending manga
  const heroManga = trendingData[0]
  
  const HERO_MANGA = {
    id: heroManga.id,
    title: heroManga.title.english || heroManga.title.romaji,
    synopsis: heroManga.description?.replace(/<[^>]*>?/gm, '') || "No synopsis available.",
    image: heroManga.coverImage.extraLarge,
    genres: heroManga.genres.slice(0, 3),
    rating: heroManga.averageScore ? heroManga.averageScore / 10 : null
  }

  // Format arrays for our MangaCard component
  const formatManga = (m: any) => ({
    id: String(m.id),
    title: m.title.english || m.title.romaji,
    coverImage: m.coverImage.large,
    rating: m.averageScore ? m.averageScore / 10 : undefined,
    status: m.status === 'RELEASING' ? 'NEW' : undefined,
    chapter: m.chapters
  })

  const TRENDING_NOW = trendingData.slice(1).map(formatManga)
  const ALL_TIME_POPULAR = popularData.map(formatManga)

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] min-h-[400px] md:min-h-[500px] w-full overflow-hidden">
        {HERO_MANGA.image && (
          <Image
            src={HERO_MANGA.image}
            alt={HERO_MANGA.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
          <div className="max-w-2xl space-y-4">
            <div className="flex gap-2 text-yellow-400 font-bold items-center mb-2">
              <TrendingUp className="w-5 h-5" />
              #1 Trending Worldwide
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {HERO_MANGA.genres.map((genre: string) => (
                <span key={genre} className="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] md:text-xs font-medium text-purple-300 border border-purple-500/20">
                  {genre}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-6xl font-black text-foreground tracking-tighter leading-tight">
              {HERO_MANGA.title}
            </h1>
            
            <p className="text-muted-foreground text-xs md:text-base line-clamp-2 md:line-clamp-none leading-relaxed max-w-xl">
              {HERO_MANGA.synopsis}
            </p>
            
            <div className="flex items-center gap-3 md:gap-4 pt-2 md:pt-4">
              <Link href={`/manga/${HERO_MANGA.id}`} className="flex-1 md:flex-none">
                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent-500 hover:opacity-90 text-white px-4 md:px-8 py-2.5 md:py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 text-sm md:text-base">
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  View Details
                </button>
              </Link>
              <button className="hidden sm:flex items-center gap-2 glass px-6 py-3 rounded-full font-bold text-foreground transition-all hover:bg-accent hover:scale-105 active:scale-95">
                <Plus className="w-5 h-5" />
                Add to List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 space-y-12 mt-8">
        
        {/* Trending Now */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 w-1.5 md:w-2 h-6 md:h-8 rounded-full"></span>
              Trending Now
            </h2>
            <button className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 flex items-center transition-colors">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {TRENDING_NOW.map((manga: any) => (
              <MangaCard key={manga.id} {...manga} />
            ))}
          </div>
        </section>

        {/* All-Time Popular Carousel */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              All-Time Popular
            </h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {ALL_TIME_POPULAR.map((manga: any) => (
              <div key={manga.id} className="min-w-[160px] md:min-w-[200px] snap-start">
                <MangaCard {...manga} />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
