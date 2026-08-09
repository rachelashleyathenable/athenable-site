import { getTranslations, setRequestLocale } from "next-intl/server";
import { VideoModalTrigger } from "@/components/video-modal-trigger";
import { QuizModalTrigger } from "@/components/quiz-modal-trigger";
import { Button } from "@/components/button";
import { VideoBackground } from "@/components/video-background";
import { siteConfig } from "@/lib/site-config";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy pt-32 pb-28 text-white sm:pt-36">
        <VideoBackground src="/hero-bg.mp4" />
        <div aria-hidden="true" className="absolute inset-0 bg-navy/70" />
        <div className="relative mx-auto max-w-[1080px] px-5 sm:px-8">
          <div className="mb-7">
            <h1 className="max-w-[560px] font-display text-[clamp(32px,4.6vw,52px)] leading-[1.1] font-bold text-blue-light">
              {t("heroTitle")}
            </h1>
          </div>
          <p className="mb-11 max-w-[540px] text-[17px] leading-relaxed text-white/72">
            {t("heroText")}
          </p>
          <VideoModalTrigger label={t("heroCta")} />
        </div>
      </section>

      {/* LE MONDE CHANGE */}
      <section className="bg-ice py-24 sm:py-28">
        <div className="mx-auto max-w-[680px] px-5 text-center sm:px-8">
          <h2 className="mb-3 font-display text-[clamp(26px,3.2vw,36px)] leading-tight text-navy">
            {t("worldTitle")}
          </h2>

          <div className="mt-14">
            <h3 className="mb-4 font-display text-2xl font-bold text-navy">
              {t("worldSubtitle")}
            </h3>
            <p className="mx-auto mb-8 max-w-[520px] text-[16.5px] leading-relaxed text-ink-muted">
              {t("worldText")}
            </p>
            <QuizModalTrigger label={t("quizCta")} />
          </div>

          <div className="mx-auto my-14 h-px max-w-[520px] bg-line" />

          <div>
            <h3 className="mb-4 font-display text-2xl font-bold text-navy">{t("stayTitle")}</h3>
            <p className="mx-auto mb-2 max-w-[520px] text-[16.5px] font-medium text-navy">
              {t("stayLead")}
            </p>
            <p className="mx-auto mb-8 max-w-[520px] text-[16.5px] leading-relaxed text-ink-muted">
              {t("stayText")}
            </p>
            <Button href={siteConfig.communityUrl} variant="ghost">
              {t("communityCta")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
