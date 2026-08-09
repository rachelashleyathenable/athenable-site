import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { BRAND_CONTEXT } from "./brand-context";

const adSuggestionSchema = z.object({
  headline: z.string().max(30),
  description: z.string().max(90),
  keywords: z.array(z.string()).min(3).max(10),
});

const adCopySchema = z.object({
  suggestions: z.array(adSuggestionSchema).min(3).max(5),
});

export type GeneratedAdSuggestion = z.infer<typeof adSuggestionSchema>;

export async function generateAdCopy(input: { topic?: string; focusKeyword?: string }) {
  const brief = input.focusKeyword
    ? `Le mot-clé cible à optimiser est : "${input.focusKeyword}".`
    : input.topic
      ? `Le sujet/angle demandé est : "${input.topic}".`
      : `Choisis l'angle le plus pertinent pour attirer des prospects qualifiés.`;

  const { object } = await generateObject({
    model: anthropic("claude-sonnet-5"),
    schema: adCopySchema,
    system: `Tu es le rédacteur publicitaire d'Athenable. Tu écris en français, dans un ton clair, direct et professionnel, cohérent avec le positionnement de la marque ci-dessous.

${BRAND_CONTEXT}

Consignes pour les annonces (format Google Ads) :
- Titre (headline) : 30 caractères maximum, percutant, pas de ponctuation superflue.
- Description : 90 caractères maximum, met en avant un bénéfice concret et un appel à l'action.
- Mots-clés : liste de termes de recherche pertinents que cette annonce doit cibler.
- Ne jamais inventer de chiffres, statistiques ou promesses non vérifiables.
- Propose plusieurs variantes avec des angles différents (bénéfice, urgence, preuve sociale, curiosité).`,
    prompt: `Génère 3 à 5 variantes d'annonce publicitaire pour Athenable. ${brief}`,
  });

  return object.suggestions;
}
