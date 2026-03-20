"use client"

import { useState } from "react"
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function ImportPage() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ imported: number, failed: string[] } | null>(null)

  const handleImport = async () => {
    if (!text.trim()) return;
    
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      })
      
      const data = await res.json()
      if (data.success) {
        setResult(data.results)
      } else {
        alert(data.error || "Failed to import list.")
      }
    } catch (error) {
      console.error(error)
      alert("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
          <Upload className="w-8 h-8 text-purple-400 relative z-10" />
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Import Library
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Paste your manga titles from notes, text, or export files. We'll automatically identify them and add them to your tracking library.
        </p>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
            <FileText className="w-4 h-4 text-purple-400" />
            Paste Manga Titles (One per line)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="One Piece&#10;Chainsaw Man&#10;Solo Leveling&#10;Jujutsu Kaisen..."
            className="w-full h-64 bg-black/40 border border-white/5 rounded-2xl p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-medium resize-none placeholder-zinc-600 shadow-inner"
            disabled={loading}
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-xs text-zinc-500">
              Matches are fuzzy searched against the AniList database.
            </p>
            <button
              onClick={handleImport}
              disabled={loading || !text.trim()}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-zinc-900 font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Start Import
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
               <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Import Complete</h3>
              <p className="text-zinc-400 mt-1">
                Successfully added <strong className="text-white">{result.imported}</strong> manga to your library.
              </p>
            </div>
          </div>

          {result.failed.length > 0 && (
            <div className="w-full md:w-auto bg-black/40 border border-red-500/20 rounded-xl p-4 ml-auto">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-2">
                 <AlertCircle className="w-4 h-4" />
                 Failed to find ({result.failed.length}):
              </div>
              <ul className="text-xs text-zinc-400 space-y-1 max-h-24 overflow-y-auto scrollbar-hide pr-4">
                {result.failed.map((fail, i) => (
                  <li key={i} className="truncate">{fail}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

    </div>
  )
}
