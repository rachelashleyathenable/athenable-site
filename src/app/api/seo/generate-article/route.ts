import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { generateArticleDraft } from "@/lib/seo/generate-article";
import { createDraftArticle } from "@/lib/seo/create-draft";

const PROMPT_VERSION = "v1";

type GenerateBody = {
  topic?: string;
  focusKeyword?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as GenerateBody;
  const { topic } = body;
  let { focusKeyword } = body;
  let keywordId: number | null = null;

  if (!topic && !focusKeyword) {
    const [candidate] = await sql`
      select id, keyword from seo_keywords
      where last_article_generated_at is null
      order by is_priority desc, created_at asc
      limit 1
    `;

    if (!candidate) {
      return NextResponse.json(
        { error: "Aucun mot-clé disponible — précise un topic ou un focusKeyword, ou synchronise les mots-clés d'abord." },
        { status: 400 },
      );
    }

    keywordId = candidate.id as number;
    focusKeyword = candidate.keyword as string;
  }

  const generated = await generateArticleDraft({ topic, focusKeyword });
  const draft = await createDraftArticle(generated, {
    sourceKeyword: focusKeyword,
    promptVersion: PROMPT_VERSION,
  });

  if (keywordId) {
    await sql`update seo_keywords set last_article_generated_at = now() where id = ${keywordId}`;
  }

  await sql`
    insert into seo_activity_log (action_type, summary, detail, related_keyword_id, related_sanity_doc_id)
    values (
      'article_generated',
      ${`Brouillon généré : "${draft.title}"`},
      ${JSON.stringify({ topic, focusKeyword, sanityId: draft.sanityId })},
      ${keywordId},
      ${draft.sanityId}
    )
  `;

  return NextResponse.json({ ok: true, sanityId: draft.sanityId, title: draft.title });
}
