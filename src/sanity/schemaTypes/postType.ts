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
  ],
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
