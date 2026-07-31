import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { syncGscData } from "@/lib/seo/sync-gsc";

export async function POST() {
  const result = await syncGscData();

  await sql`
    insert into seo_activity_log (action_type, summary, detail)
    values (
      'keywords_synced',
      ${`Synchronisation Search Console : ${result.upserted} lignes, ${result.discovered} nouveaux mots-clés découverts`},
      ${JSON.stringify(result)}
    )
  `;

  return NextResponse.json({ ok: true, ...result });
}
