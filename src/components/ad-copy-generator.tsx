"use client";

import { useState } from "react";
import type { GeneratedAdSuggestion } from "@/lib/seo/generate-ads";

export function AdCopyGenerator() {
  const [values, setValues] = useState({ topic: "", focusKeyword: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<GeneratedAdSuggestion[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/seo/generate-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: values.topic || undefined,
          focusKeyword: values.focusKeyword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de la génération");
      setSuggestions(data.suggestions);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  function copyToClipboard(suggestion: GeneratedAdSuggestion, index: number) {
    const text = `${suggestion.headline}\n${suggestion.description}\nMots-clés : ${suggestion.keywords.join(", ")}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex((current) => (current === index ? null : current)), 2000);
  }

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="mb-5 flex flex-col gap-3 rounded-2xl border border-line bg-ice p-6">
        <p className="text-[13.5px] text-ink-muted">
          L&apos;IA génère des variantes de titre, description et mots-clés à copier-coller directement dans Google
          Ads (ou toute autre régie). Laisse les champs vides pour que l&apos;IA choisisse l&apos;angle.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Sujet / angle (optionnel)"
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
            {status === "submitting" ? "Génération..." : "Générer des annonces"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {suggestions.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {suggestions.map((s, i) => (
            <div key={i} className="rounded-2xl border border-line bg-white p-5">
              <p className="mb-1 font-display text-[15px] font-bold text-navy">{s.headline}</p>
              <p className="mb-3 text-[13.5px] text-ink-muted">{s.description}</p>
              <p className="mb-4 text-[12px] text-ink-muted">Mots-clés : {s.keywords.join(", ")}</p>
              <button
                type="button"
                onClick={() => copyToClipboard(s, i)}
                className="rounded-lg border-[1.5px] border-line px-3.5 py-1.5 text-[13px] font-semibold text-navy transition-colors hover:border-blue hover:text-blue"
              >
                {copiedIndex === i ? "Copié !" : "Copier"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
