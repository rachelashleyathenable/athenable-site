import type { ComponentType } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CLIENT_COOKIE,
  getClientArtifact,
  verifySessionToken,
} from "@/lib/clients";
import NovaHeritageClient from "@/components/artifacts/nova-heritage-client";

// Aiguillage id d'artéfact -> composant. Ajouter un artéfact = une entrée ici.
const ARTIFACT_COMPONENTS: Record<string, ComponentType> = {
  "nova-heritage-app": NovaHeritageClient,
};

export default async function ClientArtifactPage({
  params,
}: {
  params: Promise<{ slug: string; artifact: string }>;
}) {
  const { slug, artifact } = await params;

  // Défense en profondeur : cookie valide, correspondant au slug, et l'artéfact
  // doit bien appartenir à ce client.
  const store = await cookies();
  const authedSlug = await verifySessionToken(store.get(CLIENT_COOKIE)?.value);
  if (!authedSlug || authedSlug !== slug || !getClientArtifact(slug, artifact)) {
    redirect("/entreprise");
  }

  const Artifact = ARTIFACT_COMPONENTS[artifact];
  if (!Artifact) {
    redirect(`/client/${slug}`);
  }

  return (
    <>
      <a
        href={`/client/${slug}`}
        className="fixed right-4 top-4 z-[1000] rounded-full border border-line bg-white/90 px-4 py-2 text-sm font-semibold text-navy shadow-sm backdrop-blur-sm hover:bg-white"
      >
        ← Mes outils
      </a>
      <Artifact />
    </>
  );
}

