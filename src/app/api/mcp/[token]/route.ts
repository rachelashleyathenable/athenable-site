import { NextResponse } from "next/server";
import { VEILLE_PROFILES } from "@/lib/veille/profiles";
import { readVeille } from "@/lib/veille/run";

// Connecteur Claude (serveur MCP, transport "Streamable HTTP", réponses JSON).
// URL à ajouter dans Claude > Customize > Connectors :
//   https://athenable.app/api/mcp/<VEILLE_MCP_TOKEN_<SLUG>>
// Le jeton de l'URL désigne le client : chaque client ne lit que sa veille.
// Aucune clé API ne sort d'ici ; on relit seulement le résultat de la veille.

const SERVER_INFO = { name: "athenable-veille", title: "Athenable · veille financement", version: "1.0.0" };
const SUPPORTED = ["2025-06-18", "2025-03-26", "2024-11-05"];

const TOOLS = [
  {
    name: "veille_financement",
    title: "Veille financement",
    description:
      "Renvoie la dernière veille financement du client (subventions, appels à projets, prix, fondations) : nom, organisme, montant, échéance, statut, pourquoi c'est pertinent, conditions, lien officiel et date de vérification. La veille est mise à jour automatiquement chaque semaine par Athenable.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
];

function clientForToken(token: string): string | null {
  for (const p of VEILLE_PROFILES) {
    const expected = process.env[`VEILLE_MCP_TOKEN_${p.slug.toUpperCase().replace(/-/g, "_")}`]?.trim();
    if (expected && expected.length >= 24 && safeEqual(expected, token)) return p.slug;
  }
  return null;
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

type RpcRequest = { jsonrpc: "2.0"; id?: string | number | null; method: string; params?: Record<string, unknown> };

async function handle(msg: RpcRequest, slug: string) {
  const ok = (result: unknown) => ({ jsonrpc: "2.0", id: msg.id, result });
  const fail = (code: number, message: string) => ({ jsonrpc: "2.0", id: msg.id, error: { code, message } });
  switch (msg.method) {
    case "initialize": {
      const asked = String(msg.params?.protocolVersion ?? "");
      return ok({
        protocolVersion: SUPPORTED.includes(asked) ? asked : SUPPORTED[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions: "Veille financement d'Athenable. Appelle veille_financement pour lire les appels repérés pour ce client.",
      });
    }
    case "ping":
      return ok({});
    case "tools/list":
      return ok({ tools: TOOLS });
    case "tools/call": {
      const name = msg.params?.name;
      if (name !== "veille_financement") return fail(-32602, `Outil inconnu : ${String(name)}`);
      try {
        const data = await readVeille(slug);
        return ok({
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: data,
          isError: false,
        });
      } catch (err) {
        return ok({
          content: [{ type: "text", text: `La veille n'a pas pu être lue : ${err instanceof Error ? err.message : String(err)}` }],
          isError: true,
        });
      }
    }
    default:
      return fail(-32601, `Méthode non prise en charge : ${msg.method}`);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const slug = clientForToken(token);
  if (!slug) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "JSON invalide" } }, { status: 400 });
  }
  const batch = Array.isArray(body) ? (body as RpcRequest[]) : [body as RpcRequest];
  const replies = [];
  for (const m of batch) {
    if (!m || typeof m.method !== "string") continue;
    if (m.id === undefined || m.id === null) continue; // notification : pas de réponse
    replies.push(await handle(m, slug));
  }
  if (!replies.length) return new NextResponse(null, { status: 202 });
  return NextResponse.json(Array.isArray(body) ? replies : replies[0]);
}

export async function GET() {
  return new NextResponse(null, { status: 405, headers: { Allow: "POST" } });
}

export async function DELETE() {
  return new NextResponse(null, { status: 405, headers: { Allow: "POST" } });
}
