import { MangaCard } from "@/components/shared/manga-card"
import { anilistClient, TRENDING_MANGA_QUERY } from "@/lib/api/anilist"
import { Compass } from "lucide-react"

export default async function DiscoverPage() {
  const res = await anilistClient.request<any>(TRENDING_MANGA_QUERY, { 
    page: 1,
    perPage: 30 
  })
  const results = res.Page.media

  const formattedResults = results.map((m: any) => ({
    id: String(m.id),
    title: m.title.english || m.title.romaji,
    coverImage: m.coverImage.large,
    rating: m.averageScore ? m.averageScore / 10 : undefined,
    status: m.status === 'RELEASING' ? 'NEW' : undefined,
  }))

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Compass className="w-8 h-8 text-purple-500" />
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Discover Manga
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore the latest and most popular trending manga worldwide.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {formattedResults.map((manga: any) => (
          <MangaCard key={manga.id} {...manga} />
        ))}
      </div>
    </div>
  )
}
