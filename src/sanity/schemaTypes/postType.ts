import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Opportunité / Post",
  type: "document",
  fields: [
    defineField({
      name: "tag",
      title: "Tag",
      type: "string",
      description: 'Ex : "Cette semaine", "Analyse LinkedIn", "Interview"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Extrait",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "externalUrl",
      title: "Lien externe (LinkedIn, etc.)",
      type: "url",
      description: "Optionnel — si renseigné, le post pointe vers ce lien plutôt que vers le corps de texte ci-dessous.",
    }),
    defineField({
      name: "body",
      title: "Contenu complet",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description (SEO)",
      type: "text",
      rows: 2,
      group: "seo",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "focusKeyword",
      title: "Mot-clé cible (SEO)",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "aiGenerated",
      title: "Généré par IA",
      type: "boolean",
      group: "seo",
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: "aiMeta",
      title: "Métadonnées de génération IA",
      type: "object",
      group: "seo",
      readOnly: true,
      fields: [
        defineField({ name: "model", type: "string", title: "Modèle" }),
        defineField({ name: "generatedAt", type: "datetime", title: "Généré le" }),
        defineField({ name: "sourceKeyword", type: "string", title: "Mot-clé source" }),
        defineField({ name: "promptVersion", type: "string", title: "Version du prompt" }),
      ],
    }),
  ],
  groups: [{ name: "seo", title: "SEO & IA" }],
  orderings: [
    {
      title: "Date de publication, plus récent d'abord",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "tag" },
  },
});
