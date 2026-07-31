import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type KeywordBody = {
  keyword?: string;
  isPriority?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as KeywordBody;
  const { keyword, isPriority } = body;

  if (!keyword) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await sql`
    insert into seo_keywords (keyword, source, is_priority)
    values (${keyword}, 'manual', ${isPriority ?? false})
    on conflict (keyword) do update set is_priority = ${isPriority ?? false}
  `;

  return NextResponse.json({ ok: true });
}
