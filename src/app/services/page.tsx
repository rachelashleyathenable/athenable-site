import type { Metadata } from "next";
import { Facet } from "@/components/facet";
import { Button } from "@/components/button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services — Athenable",
};

const stats = [
  { n: "1000+", l: "Publications scientifiques et rapports de référence." },
  { n: "100+", l: "Interviews de consultants ayant contribué à la méthodologie Athenable." },
];

const experiences = [
  {
    title: "Athenable Essentials",
    description:
      "Automatisez vos rapports grâce à nos modèles, guides et outils gratuits conçus pour vous faire gagner du temps.",
    cta: "Télécharger les outils",
    href: siteConfig.essentialsToolsUrl,
  },
  {
    title: "Athenable Starter",
    description:
      "Pensé pour les entrepreneurs, consultants et PME. Connectez-vous avec Google et découvrez comment Athenable transforme un rapport annuel en opportunités stratégiques en quelques minutes.",
    cta: "Découvrir Athenable Starter",
    href: siteConfig.starterAppUrl,
  },
  {
    title: "Athenable for Business",
    description:
      "Conçu pour les entreprises souhaitant intégrer Athenable à leur environnement Microsoft. Connectez-vous avec votre adresse professionnelle pour accéder à l'expérience Enterprise.",
    cta: "Se connecter",
    href: siteConfig.businessLoginUrl,
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* NOTRE MÉTHODE */}
      <section className="bg-navy py-32 text-white sm:py-40">
        <div className="mx-auto max-w-[680px] px-5 text-center sm:px-8">
          <div className="mb-7 flex items-center justify-center gap-3">
            <Facet tone="on-navy" />
            <span className="text-xs font-bold tracking-[0.16em] text-blue-light uppercase">
              Notre méthode
            </span>
          </div>

          <p className="mb-8 font-display text-[clamp(22px,2.6vw,28px)] leading-[1.35] text-white">
            Notre moteur confronte les données de votre entreprise à des publications
            scientifiques, des rapports institutionnels et des retours d&apos;expérience pour
            révéler des opportunités stratégiques concrètes.
          </p>
          <p className="mb-8 text-[17px] leading-relaxed text-white/72">
            Au-delà de l&apos;analyse, Athenable identifie des synergies entre entreprises et
            automatise la recherche, la veille et les tâches à faible valeur ajoutée.
          </p>
          <p className="mb-12 font-display text-lg font-medium text-blue-light">
            Les meilleures décisions reposent sur des faits vérifiables, pas sur des intuitions.
          </p>

          <Button href={siteConfig.methodologyUrl} variant="white">
            Consulter notre bibliothèque de sources et notre méthodologie →
          </Button>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20">
        <div className="mx-auto grid max-w-[900px] grid-cols-1 justify-items-center gap-14 px-5 sm:grid-cols-2 sm:px-8">
          {stats.map((s) => (
            <div key={s.l} className="max-w-[320px] text-center">
              <div className="mb-2 font-display text-5xl font-bold text-blue">{s.n}</div>
              <div className="text-[15px] leading-relaxed text-ink-muted">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CHOISISSEZ VOTRE EXPÉRIENCE */}
      <section className="bg-ice py-28 sm:py-32">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
          <div className="mx-auto mb-16 max-w-[560px] text-center">
            <h1 className="mb-4 font-display text-[clamp(30px,3.8vw,42px)] leading-tight text-navy">
              Choisissez votre expérience
            </h1>
            <p className="text-[16.5px] leading-relaxed text-ink-muted">
              Que vous soyez entrepreneur ou une grande entreprise, découvrez l&apos;expérience
              Athenable la plus adaptée à vos besoins.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {experiences.map((exp) => (
              <div
                key={exp.title}
                className="flex flex-col rounded-2xl border border-line bg-white p-9"
              >
                <h2 className="mb-4 font-display text-[13px] font-bold tracking-[0.1em] text-blue uppercase">
                  {exp.title}
                </h2>
                <p className="mb-8 flex-1 text-[15.5px] leading-relaxed text-ink-muted">
                  {exp.description}
                </p>
                <Button href={exp.href} variant="primary" className="justify-center">
                  {exp.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
