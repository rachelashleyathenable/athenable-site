export const BLOG_CATEGORY_SLUGS = [
  "avantages-concurrentiels",
  "prise-de-decision",
  "gestion-donnees",
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORY_SLUGS)[number];
