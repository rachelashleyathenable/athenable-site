import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { generateAdCopy } from "@/lib/seo/generate-ads";

type GenerateBody = {
  topic?: string;
  focusKeyword?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as GenerateBody;

  const suggestions = await generateAdCopy(body);

  await sql`
    insert into seo_activity_log (action_type, summary, detail)
    values (
      'ad_copy_generated',
      ${`${suggestions.length} variante(s) d'annonce générée(s)`},
      ${JSON.stringify({ topic: body.topic, focusKeyword: body.focusKeyword, suggestions })}
    )
  `;

  return NextResponse.json({ ok: true, suggestions });
}
