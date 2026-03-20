import Image from "next/image"
import Link from "next/link"
import { Star, Clock } from "lucide-react"

export interface MangaCardProps {
  id: string
  title: string
  coverImage: string
  rating?: number
  chapter?: number
  status?: string
}

export function MangaCard({ id, title, coverImage, rating, chapter, status }: MangaCardProps) {
  return (
    <Link href={`/manga/${id}`} className="block group">
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden glass-panel border border-border shadow-md transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] group-hover:-translate-y-2">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
        
        {/* Overlay Gradients - subtle in light, darker in dark */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 dark:to-black/90 transition-opacity"></div>
        
        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          {rating && (
            <div className="bg-background/80 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold text-yellow-500 dark:text-yellow-400 border border-border">
              <Star className="w-3 h-3 fill-current" />
              {rating.toFixed(1)}
            </div>
          )}
          {status === "NEW" && (
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 px-2 py-1 rounded-full text-[10px] font-bold text-white shadow-lg shadow-pink-500/30">
              NEW
            </div>
          )}
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold leading-tight line-clamp-2 text-xs md:text-sm group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
          {chapter && (
             <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-300">
               <Clock className="w-3 h-3" />
               Ch. {chapter}
             </div>
          )}
        </div>
      </div>
    </Link>
  )
}
