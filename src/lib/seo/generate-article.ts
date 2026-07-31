import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { BRAND_CONTEXT } from "./brand-context";

const articleSchema = z.object({
  title: z.string(),
  metaDescription: z.string().max(160),
  focusKeyword: z.string(),
  tag: z.string(),
  excerpt: z.string(),
  paragraphs: z.array(z.string()).min(4),
});

export type GeneratedArticle = z.infer<typeof articleSchema>;

export async function generateArticleDraft(input: { topic?: string; focusKeyword?: string }) {
  const brief = input.focusKeyword
    ? `Le mot-clé cible à optimiser est : "${input.focusKeyword}".`
    : `Le sujet demandé est : "${input.topic}".`;

  const { object } = await generateObject({
    model: anthropic("claude-sonnet-5"),
    schema: articleSchema,
    system: `Tu es le rédacteur SEO du blog Athenable. Tu écris en français, dans un ton clair, direct et professionnel, cohérent avec le positionnement de la marque ci-dessous.

${BRAND_CONTEXT}

Consignes SEO :
- Le titre doit contenir le mot-clé cible ou une variation naturelle.
- La meta description fait au maximum 160 caractères et donne envie de cliquer.
- L'article doit apporter une vraie valeur (pas de remplissage), structuré en paragraphes courts.
- Ne jamais inventer de statistiques précises ou de sources non vérifiées.`,
    prompt: `Rédige un article de blog optimisé SEO pour Athenable. ${brief}\n\nProduis un titre, une meta description, le mot-clé cible retenu, un tag court (catégorie), un extrait (2-3 phrases), et le corps de l'article sous forme de paragraphes de texte simple (pas de markdown, pas de HTML — juste des chaînes de texte, un paragraphe par élément du tableau).`,
  });

  return object;
}
