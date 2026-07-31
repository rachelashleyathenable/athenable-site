"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function KeywordControls() {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSync() {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/seo/sync-keywords", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de la synchronisation");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSyncing(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    setError(null);
    try {
      const res = await fetch("/api/seo/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim(), isPriority: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'ajout");
      setKeyword("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  return (
    <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-line bg-ice p-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleSync}
          disabled={syncing}
          className="rounded-lg border-[1.5px] border-navy px-5 py-2.5 text-[14px] font-semibold text-navy transition-colors hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {syncing ? "Synchronisation..." : "Synchroniser maintenant (Search Console)"}
        </button>
      </div>
      <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Ajouter un mot-clé prioritaire"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 rounded-lg border-[1.5px] border-line px-3.5 py-2.5 text-[14px] focus:border-blue"
        />
        <button
          type="submit"
          className="rounded-lg bg-navy px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue"
        >
          Ajouter
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
