import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "À propos — Athenable",
};

export default function AProposPage() {
  return (
    <section className="py-28 sm:py-36">
      <div className="mx-auto max-w-[720px] px-5 text-center sm:px-8">
        <h1 className="mb-4 font-display text-[clamp(34px,5vw,56px)] leading-[1.08] text-navy">
          L&apos;humain construit l&apos;avenir.
        </h1>
        <h2 className="mb-14 font-display text-[clamp(20px,2.4vw,26px)] font-medium text-blue">
          L&apos;IA automatise les données.
        </h2>

        <div className="mx-auto max-w-[620px] space-y-7 text-left text-[17px] leading-relaxed text-ink-muted">
          <p>
            Chaque jour, les entreprises génèrent une quantité considérable d&apos;informations.
            Pourtant, transformer ces données en décisions stratégiques reste un défi.
          </p>
          <p>
            Chez Athenable, nous concevons une intelligence artificielle qui automatise
            l&apos;analyse, révèle les opportunités et simplifie la complexité. Notre objectif est
            de libérer les décideurs des tâches à faible valeur ajoutée afin qu&apos;ils puissent
            se concentrer sur ce qui fait réellement la différence : comprendre, décider et
            innover.
          </p>
          <p>
            Nous croyons que la technologie n&apos;a de valeur que lorsqu&apos;elle renforce
            l&apos;intelligence humaine.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[960px] px-5 pt-32 sm:px-8 sm:pt-40">
        <h2 className="mb-10 text-center font-display text-[clamp(24px,3vw,32px)] text-navy">
          Découvrez notre vision
        </h2>

        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-ice">
          {siteConfig.visionVideoId ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${siteConfig.visionVideoId}`}
              title="Découvrez notre vision — Athenable"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-sm text-ink-muted">Vidéo bientôt disponible</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
