import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CLIENT_COOKIE, getClientBySlug, verifySessionToken } from "@/lib/clients";
import { ClientLogoutButton } from "@/components/client-logout-button";
import { ClientDataTools } from "@/components/client-data-tools";

// Menu de l'espace client : liste tous les artéfacts du client, cliquables.
export default async function ClientMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await cookies();
  const authedSlug = await verifySessionToken(store.get(CLIENT_COOKIE)?.value);
  if (!authedSlug || authedSlug !== slug) {
    redirect("/entreprise");
  }

  const client = getClientBySlug(slug);
  if (!client) {
    redirect("/entreprise");
  }

  return (
    <div className="min-h-screen bg-ice">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-5 py-5 sm:px-8">
          <span className="font-display text-[17px] font-bold tracking-wide text-navy">
            {client.name}
          </span>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-sm font-medium text-ink-muted underline-offset-2 hover:text-navy hover:underline"
            >
              ← Retour au site
            </Link>
            <ClientLogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-5 py-14 sm:px-8">
        <div className="mb-10">
          <h1 className="mb-2 font-display text-[clamp(26px,3.2vw,34px)] font-bold text-navy">
            Vos outils
          </h1>
          <p className="text-[16px] text-ink-muted">
            Sélectionnez un outil pour commencer à travailler.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {client.artifacts.map((artifact) => (
            <Link
              key={artifact.id}
              href={`/client/${slug}/${artifact.id}`}
              className="group rounded-xl border border-line bg-white p-6 shadow-sm transition-colors duration-150 hover:border-navy"
            >
              <h2 className="mb-2 font-display text-lg font-bold text-navy">
                {artifact.title}
              </h2>
              <p className="mb-4 text-[14.5px] leading-relaxed text-ink-muted">
                {artifact.description}
              </p>
              <span className="text-sm font-semibold text-blue group-hover:underline">
                Ouvrir →
              </span>
            </Link>
          ))}
        </div>

        <ClientDataTools slug={slug} />
      </main>
    </div>
  );
}
