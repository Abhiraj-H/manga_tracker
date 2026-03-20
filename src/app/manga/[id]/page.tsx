import Image from "next/image"
import Link from "next/link"
import { Star, Clock, BookOpen, Share2, Heart, Play, ListOrdered, ExternalLink } from "lucide-react"
import { anilistClient, MANGA_DETAILS_QUERY } from "@/lib/api/anilist"
import { AddToListButton } from "@/components/shared/add-to-list-button"
import { ShareButton } from "@/components/shared/share-button"

export const revalidate = 3600 // Cache for 1 hour

export default async function MangaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Fetch from AniList API
  const res = await anilistClient.request<any>(MANGA_DETAILS_QUERY, { id: parseInt(id) })
  const m = res.Media
  
  const manga = {
    id: String(m.id),
    title: m.title.english || m.title.romaji,
    author: m.staff?.edges.find((e: any) => e.role.includes("Story"))?.node.name.full || "Unknown",
    artist: m.staff?.edges.find((e: any) => e.role.includes("Art"))?.node.name.full || "Unknown",
    synopsis: m.description?.replace(/<[^>]*>?/gm, '') || "No synopsis available.",
    coverImage: m.coverImage.extraLarge,
    bannerImage: m.bannerImage || m.coverImage.extraLarge,
    genres: m.genres || [],
    status: m.status,
    rating: m.averageScore ? m.averageScore / 10 : null,
    popularity: m.popularity,
    chapters: m.chapters || '?',
    externalLinks: m.externalLinks || []
  }

  // Generate mock chapters based on knowing the total, or just an arbitrary list if unknown
  const numChapters = typeof manga.chapters === 'number' ? manga.chapters : 20;
  const displayLimit = Math.min(numChapters, 20); // Just show the latest 20 for UI purposes
  
  const chapters = Array.from({ length: displayLimit }, (_, i) => ({
    id: numChapters - i,
    number: numChapters - i,
    title: `Chapter ${numChapters - i}`,
    date: `2023-${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')}-15`,
    read: false
  }))

  return (
    <div className="pb-24">
      {/* Dynamic Banner */}
      <div className="relative h-[40vh] min-h-[300px] w-full">
        {manga.bannerImage && (
          <Image
            src={manga.bannerImage}
            alt="Banner"
            fill
            className="object-cover opacity-50"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column - Cover & Actions */}
          <div className="w-full md:w-64 lg:w-72 flex-shrink-0 space-y-6">
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden glass shadow-[0_0_40px_rgba(139,92,246,0.2)]">
              {manga.coverImage && (
                <Image
                  src={manga.coverImage}
                  alt={manga.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
            
            <div className="space-y-3">
              {manga.externalLinks.length > 0 && manga.externalLinks[0].url ? (
                <Link href={manga.externalLinks[0].url} target="_blank" rel="noopener noreferrer">
                  <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                    <ExternalLink className="w-5 h-5" />
                    Read Officially
                  </button>
                </Link>
              ) : (
                <button disabled className="w-full flex justify-center items-center gap-2 bg-zinc-800 text-zinc-500 py-3 rounded-xl font-bold cursor-not-allowed">
                  <Play className="w-5 h-5 fill-current" />
                  No Official Source
                </button>
              )}
              <div className="flex gap-3">
                <AddToListButton manga={manga} />
                <ShareButton manga={manga} />
              </div>
            </div>
            
            {/* Metadata Box */}
            <div className="glass-panel p-5 rounded-xl space-y-4 border-border">
               <div>
                 <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Status</p>
                 <p className="text-foreground font-medium">{manga.status}</p>
               </div>
               <div>
                 <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Author</p>
                 <p className="text-foreground font-medium">{manga.author}</p>
               </div>
               <div>
                 <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Artist</p>
                 <p className="text-foreground font-medium">{manga.artist}</p>
               </div>
               <div>
                 <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Popularity</p>
                 <p className="text-foreground font-medium">{manga.popularity.toLocaleString()}</p>
               </div>
            </div>
          </div>

          {/* Right Column - Info & Chapters */}
          <div className="flex-1 space-y-8 pt-4 md:pt-16">
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                {manga.title}
              </h1>
              <div className="flex flex-wrap gap-2 items-center">
                {manga.rating && (
                  <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500/10 px-3 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-current" />
                    {manga.rating}
                  </div>
                )}
                <div className="flex items-center gap-1 text-purple-500 font-bold bg-purple-500/10 px-3 py-1 rounded-lg">
                  <BookOpen className="w-4 h-4" />
                  {manga.chapters} Chapters
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {manga.genres.map((genre: string) => (
                  <span key={genre} className="px-3 py-1 flex items-center justify-center rounded-full glass border-border text-sm font-medium text-purple-500">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-foreground">Synopsis</h3>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base bg-muted/20 p-6 rounded-2xl border border-border">
                {manga.synopsis}
              </p>
            </div>

            {/* Empty API State / Links List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-purple-400" />
                Tracking & Links
              </h3>
              
              <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5">
                {manga.externalLinks.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 font-medium">
                    No external or official sources found for this manga.
                  </div>
                ) : (
                  manga.externalLinks.map((link: any, idx: number) => (
                    <a 
                      key={idx} 
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                        <p className="font-medium text-zinc-200 group-hover:text-purple-400 transition-colors">
                          {link.site}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
