import { sql } from "@/lib/db";
import { getWriteClient } from "@/sanity/write-client";

export const dynamic = "force-dynamic";

type ActivityRow = {
  id: number;
  action_type: string;
  summary: string;
  status: string;
  created_at: string;
};

async function getDraftCount() {
  try {
    return await getWriteClient().fetch<number>(
      `count(*[_type == "post" && aiGenerated == true && _id in path("drafts.**")])`,
    );
  } catch {
    return null;
  }
}

export default async function SeoOverviewPage() {
  const [activity, [keywordStats], [lastSync], draftCount] = await Promise.all([
    sql`select id, action_type, summary, status, created_at from seo_activity_log order by created_at desc limit 20` as unknown as Promise<
      ActivityRow[]
    >,
    sql`select count(*)::int as total from seo_keywords`,
    sql`select created_at from seo_activity_log where action_type = 'keywords_synced' order by created_at desc limit 1`,
    getDraftCount(),
  ]);

  return (
    <div>
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-ice p-6">
          <div className="text-xs font-bold tracking-[0.08em] text-ink-muted uppercase">Brouillons IA en attente</div>
          <div className="mt-2 font-display text-3xl font-bold text-navy">
            {draftCount === null ? "—" : draftCount}
          </div>
          {draftCount === null && (
            <p className="mt-1 text-[13px] text-ink-muted">SANITY_API_TOKEN non configuré.</p>
          )}
        </div>
        <div className="rounded-2xl border border-line bg-ice p-6">
          <div className="text-xs font-bold tracking-[0.08em] text-ink-muted uppercase">Mots-clés suivis</div>
          <div className="mt-2 font-display text-3xl font-bold text-navy">{keywordStats?.total ?? 0}</div>
        </div>
        <div className="rounded-2xl border border-line bg-ice p-6">
          <div className="text-xs font-bold tracking-[0.08em] text-ink-muted uppercase">Dernière synchro</div>
          <div className="mt-2 font-display text-lg font-bold text-navy">
            {lastSync ? new Date(lastSync.created_at).toLocaleString("fr-FR") : "Jamais"}
          </div>
        </div>
      </div>

      <h2 className="mb-4 font-display text-lg font-bold text-navy">Journal d&apos;activité</h2>
      {activity.length === 0 ? (
        <p className="text-ink-muted">Aucune action pour le moment.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {activity.map((row) => (
            <div key={row.id} className="flex items-start gap-3 rounded-xl border border-line px-4 py-3">
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${row.status === "success" ? "bg-blue" : "bg-red-500"}`}
              />
              <div className="flex-1">
                <p className="text-[14.5px] text-ink">{row.summary}</p>
                <p className="text-[12.5px] text-ink-muted">
                  {row.action_type} · {new Date(row.created_at).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
