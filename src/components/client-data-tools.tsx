"use client";

import { useRef, useState } from "react";

type Entry = { key: string; value: string };

// Export / Import des données du client (table Neon client_kv), pour sauvegarder
// ou transférer les profils saisis dans l'artéfact. Format : { entries: [{key,value}] }.
export function ClientDataTools({ slug }: { slug: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/client/storage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ op: "export" }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { entries: Entry[] };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `donnees-${slug}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMsg(`${data.entries.length} entrée(s) exportée(s).`);
    } catch {
      setMsg("L'export a échoué. Réessayez.");
    }
    setBusy(false);
  }

  async function handleImportFile(file: File) {
    setBusy(true);
    setMsg("");
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { entries?: Entry[] } | Entry[];
      const entries = Array.isArray(parsed) ? parsed : (parsed.entries ?? []);
      const res = await fetch("/api/client/storage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ op: "import", entries }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { count: number };
      setMsg(`${data.count} entrée(s) importée(s).`);
    } catch {
      setMsg("Import impossible : fichier invalide ou erreur serveur.");
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="mt-12 rounded-xl border border-line bg-white p-6">
      <h2 className="mb-1 font-display text-base font-bold text-navy">
        Sauvegarde des données
      </h2>
      <p className="mb-4 text-[14px] leading-relaxed text-ink-muted">
        Exportez les profils de votre équipe en fichier, ou importez un fichier
        exporté précédemment.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleExport}
          disabled={busy}
          className="rounded-lg border-[1.5px] border-navy px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white disabled:opacity-50"
        >
          Exporter
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="rounded-lg border-[1.5px] border-navy px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white disabled:opacity-50"
        >
          Importer
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImportFile(f);
          }}
        />
        {msg && <span className="text-sm text-ink-muted">{msg}</span>}
      </div>
    </div>
  );
}
