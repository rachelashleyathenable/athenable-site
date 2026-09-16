// Registre des clients "Athenable pour entreprise" et gestion de la session
// d'accès. Volontairement sans dépendance Node : n'utilise que Web Crypto et
// TextEncoder, afin de fonctionner aussi bien dans les Route Handlers (Node)
// que dans le proxy edge (src/proxy.ts).

export type ClientArtifact = {
  id: string; // identifiant technique, présent dans l'URL /client/<slug>/<id>
  title: string; // titre affiché dans le menu
  description: string; // sous-titre de la carte
};

export type Client = {
  slug: string; // identifiant technique, présent dans l'URL /client/<slug>
  name: string; // nom affiché
  artifacts: readonly ClientArtifact[]; // outils accessibles à ce client
};

// Pour ajouter un client : une ligne ici + une variable d'env CLIENT_<SLUG>_CODE
// (slug en MAJUSCULES, tirets remplacés par des underscores). Pour chaque
// artéfact, créer le composant dans src/components/artifacts/ et l'aiguiller
// dans src/app/(internal)/client/[slug]/[artifact]/page.tsx.
export const CLIENTS: readonly Client[] = [
  {
    slug: "nova-heritage",
    name: "Nova Heritage",
    artifacts: [
      {
        id: "nova-heritage-app",
        title: "Profils & Formation d'équipe",
        description:
          "Tests DISC / MBTI, profils individuels, parcours de formation et suivi d'équipe.",
      },
    ],
  },
] as const;

export const CLIENT_COOKIE = "athenable_client";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 h

export function getClientBySlug(slug: string): Client | null {
  return CLIENTS.find((c) => c.slug === slug) ?? null;
}

export function getClientArtifact(
  slug: string,
  artifactId: string,
): ClientArtifact | null {
  return (
    getClientBySlug(slug)?.artifacts.find((a) => a.id === artifactId) ?? null
  );
}

function envCodeVarName(slug: string): string {
  return "CLIENT_" + slug.toUpperCase().replace(/-/g, "_") + "_CODE";
}

export function getClientCode(slug: string): string | null {
  return process.env[envCodeVarName(slug)] ?? null;
}

// Le code d'accès identifie à lui seul le client (pas d'identifiant séparé).
// Comparaison à temps constant contre chaque client connu.
export function findClientByCode(code: string): Client | null {
  const trimmed = code.trim();
  if (!trimmed) return null;
  for (const c of CLIENTS) {
    const expected = getClientCode(c.slug);
    if (expected && safeEqual(trimmed, expected)) return c;
  }
  return null;
}

// Comparaison à temps constant pour éviter les timing attacks sur le code.
export function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  if (ba.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ba.length; i++) diff |= ba[i] ^ bb[i];
  return diff === 0;
}

// --- Signature du jeton de session (HMAC-SHA256, Web Crypto) ---

function getSecret(): string {
  const secret = process.env.CLIENT_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing environment variable: CLIENT_SESSION_SECRET");
  }
  return secret;
}

function b64urlFromBytes(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return b64urlFromBytes(new Uint8Array(sig));
}

// Jeton : "<slug>.<expiryMs>.<signature>"
export async function createSessionToken(slug: string): Promise<string> {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `${slug}.${exp}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

// Renvoie le slug si le jeton est valide et non expiré, sinon null.
export async function verifySessionToken(
  token: string | undefined | null,
): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [slug, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  const expected = await hmac(`${slug}.${expStr}`);
  if (!safeEqual(sig, expected)) return null;
  if (!getClientBySlug(slug)) return null;
  return slug;
}
