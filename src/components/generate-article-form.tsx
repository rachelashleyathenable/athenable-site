"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateArticleForm() {
  const router = useRouter();
  const [values, setValues] = useState({ topic: "", focusKeyword: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/seo/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: values.topic || undefined,
          focusKeyword: values.focusKeyword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de la génération");
      setValues({ topic: "", focusKeyword: "" });
      setStatus("idle");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 rounded-2xl border border-line bg-ice p-6">
      <p className="text-[13.5px] text-ink-muted">
        Laisse les deux champs vides pour que l&apos;IA choisisse le meilleur mot-clé suivi automatiquement.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Sujet (optionnel)"
          value={values.topic}
          onChange={(e) => setValues((v) => ({ ...v, topic: e.target.value }))}
          className="flex-1 rounded-lg border-[1.5px] border-line px-3.5 py-2.5 text-[14px] focus:border-blue"
        />
        <input
          type="text"
          placeholder="Mot-clé cible (optionnel)"
          value={values.focusKeyword}
          onChange={(e) => setValues((v) => ({ ...v, focusKeyword: e.target.value }))}
          className="flex-1 rounded-lg border-[1.5px] border-line px-3.5 py-2.5 text-[14px] focus:border-blue"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-lg bg-navy px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "submitting" ? "Génération..." : "Générer un brouillon"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
