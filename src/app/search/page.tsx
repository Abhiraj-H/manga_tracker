import { MangaCard } from "@/components/shared/manga-card"
import { anilistClient, SEARCH_MANGA_QUERY } from "@/lib/api/anilist"
import { Search as SearchIcon } from "lucide-react"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const query = (await searchParams).q || ""
  
  let results = []
  if (query) {
    const res = await anilistClient.request<any>(SEARCH_MANGA_QUERY, { 
      search: query,
      page: 1,
      perPage: 20 
    })
    results = res.Page.media
  }

  const formattedResults = results.map((m: any) => ({
    id: String(m.id),
    title: m.title.english || m.title.romaji,
    coverImage: m.coverImage.large,
    rating: m.averageScore ? m.averageScore / 10 : undefined,
  }))

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <SearchIcon className="w-8 h-8 text-purple-500" />
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Search Results
          </h1>
          <p className="text-muted-foreground mt-1">
            Showing results for "{query}"
          </p>
        </div>
      </div>

      {formattedResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {formattedResults.map((manga: any) => (
            <MangaCard key={manga.id} {...manga} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <SearchIcon className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No results found</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            We couldn't find any manga matching your search. Try different keywords or check for typos.
          </p>
        </div>
      )}
    </div>
  )
}
