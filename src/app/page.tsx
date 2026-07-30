import { Facet } from "@/components/facet";
import { VideoModalTrigger } from "@/components/video-modal-trigger";
import { QuizModalTrigger } from "@/components/quiz-modal-trigger";
import { Button } from "@/components/button";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy pt-32 pb-28 text-white sm:pt-36">
        <div
          aria-hidden="true"
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-line-on-navy) 1px, transparent 1px), linear-gradient(90deg, var(--color-line-on-navy) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto max-w-[1080px] px-5 sm:px-8">
          <div className="mb-7 flex items-start gap-3">
            <Facet tone="on-navy" className="mt-2" />
            <h1 className="max-w-[560px] font-display text-[clamp(32px,4.6vw,52px)] leading-[1.1] font-bold text-blue-light">
              Transformez vos données en opportunités
            </h1>
          </div>
          <p className="mb-11 max-w-[540px] text-[17px] leading-relaxed text-white/72">
            L&apos;intelligence artificielle rencontre la recherche scientifique pour transformer
            vos données en recommandations stratégiques, claires, justifiées et directement
            actionnables.
          </p>
          <VideoModalTrigger label="Voir Athenable en action →" />
        </div>
      </section>

      {/* LE MONDE CHANGE */}
      <section className="bg-ice py-24 sm:py-28">
        <div className="mx-auto max-w-[680px] px-5 text-center sm:px-8">
          <h2 className="mb-3 font-display text-[clamp(26px,3.2vw,36px)] leading-tight text-navy">
            Le monde change. Athenable aussi.
          </h2>

          <div className="mt-14">
            <h3 className="mb-4 font-display text-2xl font-bold text-navy">
              Et vous, où en êtes-vous ?
            </h3>
            <p className="mx-auto mb-8 max-w-[520px] text-[16.5px] leading-relaxed text-ink-muted">
              Prenez quelques minutes pour évaluer la maturité stratégique de votre entreprise.
            </p>
            <QuizModalTrigger label="Faire le quiz →" />
          </div>

          <div className="mx-auto my-14 h-px max-w-[520px] bg-line" />

          <div>
            <h3 className="mb-4 font-display text-2xl font-bold text-navy">Restez informé</h3>
            <p className="mx-auto mb-2 max-w-[520px] text-[16.5px] font-medium text-navy">
              La réflexion ne s&apos;arrête pas ici.
            </p>
            <p className="mx-auto mb-8 max-w-[520px] text-[16.5px] leading-relaxed text-ink-muted">
              Rejoignez la communauté Athenable pour échanger avec d&apos;autres dirigeants,
              entrepreneurs et décideurs, développer votre réseau, partager les meilleures
              pratiques et contribuer à la construction de l&apos;intelligence stratégique de
              demain.
            </p>
            <Button href={siteConfig.discordInvite} variant="ghost">
              Rejoindre la communauté →
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
