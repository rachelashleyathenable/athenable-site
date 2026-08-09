import { sql } from "@/lib/db";
import { KeywordControls } from "@/components/keyword-controls";

export const dynamic = "force-dynamic";

type KeywordRow = {
  id: number;
  keyword: string;
  source: string;
  is_priority: boolean;
  last_article_generated_at: string | null;
  impressions: number | null;
  clicks: number | null;
  position: number | null;
};

export default async function KeywordsPage() {
  const keywords = await sql`
    select
      k.id, k.keyword, k.source, k.is_priority, k.last_article_generated_at,
      sum(m.impressions)::int as impressions,
      sum(m.clicks)::int as clicks,
      avg(m.position)::numeric(10,1) as position
    from seo_keywords k
    left join seo_gsc_metrics m on m.keyword_id = k.id
    group by k.id
    order by k.is_priority desc, impressions desc nulls last, k.created_at desc
  ` as unknown as KeywordRow[];

  return (
    <div>
      <KeywordControls />

      {keywords.length === 0 ? (
        <p className="text-ink-muted">
          Aucun mot-clé suivi pour le moment — ajoute-en un ou synchronise Search Console.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted">
                <th className="py-2 pr-4">Mot-clé</th>
                <th className="py-2 pr-4">Source</th>
                <th className="py-2 pr-4">Impressions (28j)</th>
                <th className="py-2 pr-4">Clics (28j)</th>
                <th className="py-2 pr-4">Position moy.</th>
                <th className="py-2 pr-4">Article généré</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((k) => (
                <tr key={k.id} className="border-b border-line">
                  <td className="py-2 pr-4 font-medium text-navy">
                    {k.is_priority && <span className="mr-1.5">★</span>}
                    {k.keyword}
                  </td>
                  <td className="py-2 pr-4 text-ink-muted">{k.source}</td>
                  <td className="py-2 pr-4">{k.impressions ?? "—"}</td>
                  <td className="py-2 pr-4">{k.clicks ?? "—"}</td>
                  <td className="py-2 pr-4">{k.position ?? "—"}</td>
                  <td className="py-2 pr-4 text-ink-muted">
                    {k.last_article_generated_at ? new Date(k.last_article_generated_at).toLocaleDateString("fr-FR") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
