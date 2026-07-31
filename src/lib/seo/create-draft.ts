import { randomUUID } from "crypto";
import { getWriteClient } from "@/sanity/write-client";
import { paragraphsToBlocks } from "./portable-text";
import type { GeneratedArticle } from "./generate-article";

function slugify(title: string) {
  return title
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export async function createDraftArticle(
  generated: GeneratedArticle,
  meta: { sourceKeyword?: string; promptVersion: string },
) {
  const slug = slugify(generated.title);

  const doc = await getWriteClient().create({
    _id: `drafts.${randomUUID()}`,
    _type: "post",
    title: generated.title,
    tag: generated.tag,
    slug: { _type: "slug", current: slug },
    excerpt: generated.excerpt,
    metaDescription: generated.metaDescription,
    focusKeyword: generated.focusKeyword,
    body: paragraphsToBlocks(generated.paragraphs),
    publishedAt: new Date().toISOString(),
    aiGenerated: true,
    aiMeta: {
      model: "claude-sonnet-5",
      generatedAt: new Date().toISOString(),
      sourceKeyword: meta.sourceKeyword ?? generated.focusKeyword,
      promptVersion: meta.promptVersion,
    },
  });

  return { sanityId: doc._id, title: generated.title, slug };
}
