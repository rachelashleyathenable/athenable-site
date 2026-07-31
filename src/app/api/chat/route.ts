import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { BRAND_CONTEXT } from "@/lib/seo/brand-context";

export const maxDuration = 30;

const SYSTEM_PROMPT = `Tu es l'assistant du site Athenable. Réponds en français, de façon brève, claire et directe (pas de blabla).

${BRAND_CONTEXT}

Réponds uniquement aux questions liées à Athenable, son produit, sa méthodologie et ses offres. Si une question est hors sujet, décline poliment et propose de revenir au sujet d'Athenable. Si tu ne connais pas une information précise (prix exact, détails techniques non mentionnés ici), invite la personne à utiliser le formulaire de contact plutôt que d'inventer une réponse.`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-5"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
