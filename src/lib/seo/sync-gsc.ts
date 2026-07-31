import { sql } from "@/lib/db";
import { fetchSearchAnalytics } from "./gsc-client";

const DISCOVERY_IMPRESSION_THRESHOLD = 5;

function last28Days() {
  const end = new Date();
  end.setDate(end.getDate() - 3); // GSC data has a ~2-3 day reporting delay
  const start = new Date(end);
  start.setDate(start.getDate() - 28);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

export async function syncGscData() {
  const { startDate, endDate } = last28Days();
  const rows = await fetchSearchAnalytics({ startDate, endDate });

  let upserted = 0;
  let discovered = 0;

  for (const row of rows) {
    const [query, page, date] = row.keys ?? [];
    if (!query || !date) continue;

    const [existingKeyword] = await sql`
      select id from seo_keywords where keyword = ${query}
    `;

    let keywordId = existingKeyword?.id as number | undefined;

    if (!keywordId && (row.impressions ?? 0) >= DISCOVERY_IMPRESSION_THRESHOLD) {
      const [inserted] = await sql`
        insert into seo_keywords (keyword, source)
        values (${query}, 'gsc_discovered')
        on conflict (keyword) do nothing
        returning id
      `;
      keywordId = inserted?.id as number | undefined;
      if (keywordId) discovered += 1;
    }

    await sql`
      insert into seo_gsc_metrics (keyword_id, query, page_url, metric_date, clicks, impressions, ctr, position)
      values (${keywordId ?? null}, ${query}, ${page ?? null}, ${date}, ${row.clicks ?? 0}, ${row.impressions ?? 0}, ${row.ctr ?? null}, ${row.position ?? null})
      on conflict (query, page_url, metric_date)
      do update set clicks = excluded.clicks, impressions = excluded.impressions, ctr = excluded.ctr, position = excluded.position, synced_at = now()
    `;
    upserted += 1;
  }

  return { upserted, discovered, startDate, endDate };
}
