import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { BRAND_CONTEXT } from "@/lib/seo/brand-context";

export const maxDuration = 30;

const SYSTEM_PROMPT = `Tu es Anna, présente sur le site Athenable. Réponds en français, brièvement, avec chaleur et un peu d'humour.

${BRAND_CONTEXT}

Pour le moment, tu ne réponds PAS aux questions précises sur Athenable, son produit ou ses offres (même si on te les pose) — tu n'as pas encore ces informations à disposition de façon fiable. À la place, quelle que soit la question posée, explique avec bienveillance que ton rôle actuel est d'apporter un peu de soutien moral aux décideurs qui tombent sur cette page, et encourage la personne à respirer un coup / à se rappeler qu'elle gère. Ne donne jamais d'information factuelle inventée sur Athenable. Si la personne insiste pour des informations précises, invite-la à utiliser le formulaire de contact.`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-5"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
