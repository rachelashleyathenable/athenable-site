"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import type { ClientArtifact } from "@/lib/clients";

// Carte d'un outil dans le menu client. Reprend le style des autres cartes.
// Si `trackEvent` est fourni, envoie l'événement Vercel Analytics correspondant
// au clic (ex. "ouvrir_atelier" pour l'atelier Minova), avec le paramètre
// client = slug. Vercel Analytics est sans cookies : aucun consentement requis.
export function ClientToolCard({
  slug,
  artifact,
  trackEvent,
}: {
  slug: string;
  artifact: ClientArtifact;
  trackEvent?: string;
}) {
  const content = (
    <>
      <h2 className="mb-2 font-display text-lg font-bold text-navy">
        {artifact.title}
      </h2>
      <p className="mb-4 text-[14.5px] leading-relaxed text-ink-muted">
        {artifact.description}
      </p>
      <span className="text-sm font-semibold text-blue group-hover:underline">
        Ouvrir →
      </span>
    </>
  );

  const className =
    "group rounded-xl border border-line bg-white p-6 shadow-sm transition-colors duration-150 hover:border-navy";

  if (artifact.externalUrl) {
    return (
      <a
        href={artifact.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          if (trackEvent) track(trackEvent, { client: slug, outil: artifact.id });
        }}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={`/client/${slug}/${artifact.id}`}
      onClick={() => {
        if (trackEvent) track(trackEvent, { client: slug, outil: artifact.id });
      }}
      className={className}
    >
      {content}
    </Link>
  );
}
