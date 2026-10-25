import { sql } from "@/lib/db";
import { getVeilleProfile, type VeilleProfile } from "./profiles";

// Veille financement : Claude (clé ANTHROPIC_API_KEY du site, jamais exposée)
// cherche sur le web les appels ouverts pour un client, puis on les range dans
// Neon. Le connecteur MCP (/api/mcp/<token>) ne fait que relire ce résultat.

export type Funding = {
  id: string;
  nom: string;
  organisme: string;
  region: string;
  montant: string;
  echeance: string;
  statut_appel: string; // ouvert | bientôt | à vérifier | prochaine édition | suspendu | fermé
  pourquoi: string;
  eligibilite: string[];
  attention: string;
  lien: string;
  verifie: string; // date de la vérification (AAAA-MM-JJ)
  priorite: number; // 1 = à regarder en premier
};

const MODEL = process.env.VEILLE_MODEL?.trim() || "claude-sonnet-5-5";
const STATUTS = ["ouvert", "bientôt", "à vérifier", "prochaine édition", "suspendu", "fermé"];

let tablesReady = false;
async function ensureTables() {
  if (tablesReady) return;
  await sql`
    create table if not exists veille_financement (
      client_slug text not null,
      id text not null,
      data jsonb not null,
      first_seen timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      primary key (client_slug, id)
    )
  `;
  await sql`
    create table if not exists veille_runs (
      id serial primary key,
      client_slug text not null,
      status text not null,
      found integer not null default 0,
      detail text,
      created_at timestamptz not null default now()
    )
  `;
  tablesReady = true;
}

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function buildPrompt(profile: VeilleProfile, today: string, known: string[]) {
  return `Tu fais la veille financement de ce projet. Nous sommes le ${today}.

PROJET
${profile.description}

TÂCHE
Cherche sur le web les financements non dilutifs auxquels ce projet peut candidater maintenant ou dans les 6 prochains mois : subventions publiques, appels à projets, prix, fondations, mécénat, bourses. Vérifie chaque appel sur la page officielle de l'organisme (dates, montant, conditions). N'invente rien : si une information n'est pas confirmée, écris "à vérifier".
${known.length ? `\nDéjà dans la veille (mets-les à jour s'ils sont toujours pertinents, sinon ignore-les) : ${known.join(" ; ")}.\n` : ""}
RÉPONSE
Une fois tes recherches terminées, appelle l'outil submit_fundings une seule fois avec 5 à 10 financements, classés du plus prioritaire au moins prioritaire. N'écris pas de tableau JSON dans le texte : le resultat doit passer uniquement par cet outil.`;
}

type Block = { type: string; text?: string; id?: string; name?: string; input?: unknown };

const SUBMIT_TOOL = {
  name: "submit_fundings",
  description:
    "Soumets la liste finale des financements trouvés pour ce projet, une seule fois, une fois les recherches web terminées.",
  input_schema: {
    type: "object",
    properties: {
      fundings: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          properties: {
            nom: { type: "string", description: "Nom de l'appel" },
            organisme: { type: "string", description: "Qui finance" },
            region: { type: "string", enum: ["Bruxelles", "Wallonie", "FWB", "Belgique", "Europe", "autre"] },
            montant: { type: "string", description: "Montant ou fourchette" },
            echeance: { type: "string", description: "Date limite ou calendrier" },
            statut_appel: { type: "string", enum: STATUTS },
            pourquoi: { type: "string", description: "Une phrase : pourquoi c'est pertinent pour ce projet" },
            eligibilite: { type: "array", items: { type: "string" }, description: "2 à 4 conditions clés" },
            attention: { type: "string", description: "Un point de vigilance, ou chaîne vide" },
            lien: { type: "string", description: "URL officielle de l'appel" },
          },
          required: ["nom", "organisme", "region", "montant", "echeance", "statut_appel", "pourquoi", "eligibilite", "attention", "lien"],
        },
      },
    },
    required: ["fundings"],
  },
};

// On force la reponse finale a passer par l'outil submit_fundings (schema valide par
// l'API) plutot que de demander au modele d'ecrire du JSON en texte libre : ce dernier
// produisait de temps en temps une syntaxe invalide (virgule manquante, etc.) impossible
// a corriger de facon fiable cote serveur.
async function callClaude(prompt: string): Promise<Record<string, unknown>[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY manquante");
  const messages: { role: "user" | "assistant"; content: unknown }[] = [{ role: "user", content: prompt }];
  // La recherche web peut s'interrompre ("pause_turn") avant l'appel final a submit_fundings.
  for (let i = 0; i < 6; i++) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 8000,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 12 }, SUBMIT_TOOL],
        messages,
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status} : ${(await res.text()).slice(0, 300)}`);
    const data = (await res.json()) as { content: Block[]; stop_reason: string };
    const submit = data.content.find((b) => b.type === "tool_use" && b.name === "submit_fundings");
    if (submit) {
      const input = submit.input as { fundings?: unknown };
      if (!Array.isArray(input.fundings)) throw new Error("submit_fundings sans tableau 'fundings'");
      return input.fundings as Record<string, unknown>[];
    }
    if (data.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: data.content });
  }
  throw new Error("Le modèle n'a pas appelé submit_fundings");
}

function mapFundings(raw: Record<string, unknown>[], today: string): Funding[] {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  return raw
    .filter((r) => str(r.nom))
    .map((r, i) => {
      const statut = str(r.statut_appel);
      const lien = str(r.lien);
      return {
        id: slugify(`${str(r.organisme)} ${str(r.nom)}`) || `appel-${i + 1}`,
        nom: str(r.nom),
        organisme: str(r.organisme),
        region: str(r.region),
        montant: str(r.montant) || "à vérifier",
        echeance: str(r.echeance) || "à vérifier",
        statut_appel: STATUTS.includes(statut) ? statut : "à vérifier",
        pourquoi: str(r.pourquoi),
        eligibilite: Array.isArray(r.eligibilite) ? r.eligibilite.map(str).filter(Boolean).slice(0, 5) : [],
        attention: str(r.attention),
        lien: /^https?:\/\//.test(lien) ? lien : "",
        verifie: today,
        priorite: i + 1,
      };
    });
}

export async function runVeille(slug: string) {
  const profile = getVeilleProfile(slug);
  if (!profile) throw new Error(`Pas de profil de veille pour « ${slug} »`);
  await ensureTables();
  const today = new Date().toISOString().slice(0, 10);
  const knownRows = (await sql`
    select data->>'nom' as nom from veille_financement
    where client_slug = ${slug} and updated_at > now() - interval '60 days'
  `) as { nom: string }[];
  try {
    const raw = await callClaude(buildPrompt(profile, today, knownRows.map((r) => r.nom)));
    const fundings = mapFundings(raw, today);
    for (const f of fundings) {
      await sql`
        insert into veille_financement (client_slug, id, data)
        values (${slug}, ${f.id}, ${JSON.stringify(f)})
        on conflict (client_slug, id) do update set data = excluded.data, updated_at = now()
      `;
    }
    await sql`insert into veille_runs (client_slug, status, found) values (${slug}, 'ok', ${fundings.length})`;
    return { slug, found: fundings.length };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await sql`insert into veille_runs (client_slug, status, detail) values (${slug}, 'error', ${msg.slice(0, 500)})`;
    throw err;
  }
}

export async function readVeille(slug: string) {
  await ensureTables();
  const rows = (await sql`
    select data, first_seen, updated_at from veille_financement
    where client_slug = ${slug} and updated_at > now() - interval '45 days'
    order by updated_at desc, (data->>'priorite')::int asc
    limit 30
  `) as { data: Funding; first_seen: string; updated_at: string }[];
  const last = (await sql`
    select status, found, created_at from veille_runs
    where client_slug = ${slug} order by created_at desc limit 1
  `) as { status: string; found: number; created_at: string }[];
  return {
    client: slug,
    derniere_veille: last[0] ? { date: last[0].created_at, statut: last[0].status, trouves: last[0].found } : null,
    financements: rows.map((r) => ({ ...r.data, vu_la_premiere_fois: r.first_seen })),
  };
}
