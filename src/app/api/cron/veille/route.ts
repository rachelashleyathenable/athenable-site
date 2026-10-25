import { NextResponse } from "next/server";
import { VEILLE_PROFILES } from "@/lib/veille/profiles";
import { runVeille } from "@/lib/veille/run";

// Lancé par Vercel Cron (voir vercel.json). Vercel envoie
// "Authorization: Bearer <CRON_SECRET>" ; tout autre appel est refusé.
// Pour lancer à la main :  curl -H "Authorization: Bearer <CRON_SECRET>" https://athenable.app/api/cron/veille
export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const only = new URL(request.url).searchParams.get("client");
  const results = [];
  for (const p of VEILLE_PROFILES) {
    if (only && p.slug !== only) continue;
    try {
      results.push(await runVeille(p.slug));
    } catch (err) {
      results.push({ slug: p.slug, error: err instanceof Error ? err.message : String(err) });
    }
  }
  return NextResponse.json({ ok: true, results });
}
