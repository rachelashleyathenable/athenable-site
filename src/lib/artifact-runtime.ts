// Fournit, côté navigateur, les deux dépendances du runtime des artéfacts
// Claude que le site doit émuler :
//   1. window.storage  → stockage clé-valeur partagé (proxifié vers /api/client/storage)
//   2. fetch vers api.anthropic.com → réécrit vers /api/client/ai (proxy authentifié)
// À appeler au chargement du module client, AVANT le premier rendu de l'artéfact,
// pour que ses effets (loadProfiles, etc.) trouvent window.storage déjà en place.

declare global {
  interface Window {
    storage?: {
      get: (key: string, shared?: boolean) => Promise<{ value: string | null }>;
      set: (key: string, value: string, shared?: boolean) => Promise<{ ok: true }>;
      list: (prefix: string, shared?: boolean) => Promise<{ keys: string[] }>;
      delete: (key: string, shared?: boolean) => Promise<{ ok: true }>;
    };
    __athenableArtifactRuntime?: boolean;
  }
}

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

async function storageCall(payload: Record<string, unknown>) {
  const res = await fetch("/api/client/storage", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`storage ${payload.op} failed: ${res.status}`);
  return res.json();
}

export function installArtifactRuntime(): void {
  if (typeof window === "undefined") return;
  if (window.__athenableArtifactRuntime) return;
  window.__athenableArtifactRuntime = true;

  window.storage = {
    get: (key) => storageCall({ op: "get", key }),
    set: (key, value) => storageCall({ op: "set", key, value }),
    list: (prefix) => storageCall({ op: "list", prefix }),
    delete: (key) => storageCall({ op: "delete", key }),
  };

  const originalFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    if (url && url.startsWith(ANTHROPIC_URL)) {
      return originalFetch("/api/client/ai", init);
    }
    return originalFetch(input as RequestInfo | URL, init);
  }) as typeof window.fetch;
}
