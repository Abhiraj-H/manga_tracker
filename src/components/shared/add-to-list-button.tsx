"use client";

import { useState } from "react";
import { Plus, Check, Loader2 } from "lucide-react";

export function AddToListButton({ manga }: { manga: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mangaId: manga.id,
          title: manga.title,
          coverImage: manga.coverImage,
          total: manga.chapters === '?' ? null : manga.chapters
        })
      });
      
      if (res.ok) setSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={loading || success}
      className={`flex-1 flex justify-center items-center gap-2 glass py-3 rounded-xl font-bold text-white transition-all ${success ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'hover:bg-white/10'} disabled:opacity-50`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : success ? (
        <>
          <Check className="w-5 h-5" />
          Added
        </>
      ) : (
        <>
          <Plus className="w-5 h-5" />
          Add to List
        </>
      )}
    </button>
  );
}
