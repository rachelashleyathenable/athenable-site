import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/button";
import { VideoBackground } from "@/components/video-background";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return { title: t("metaTitle") };
}

function ExperienceTab({
  title,
  hoverLabel,
  href,
}: {
  title: string;
  hoverLabel: string;
  href: string;
}) {
  const isExternal = /^https?:\/\//.test(href);
  const className =
    "group relative flex-1 min-h-[110px] overflow-hidden rounded-lg border-[1.5px] border-white bg-navy/40 backdrop-blur-sm transition-colors duration-150 hover:bg-white";

  const content = (
    <>
      <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-[15px] font-semibold text-white transition-opacity duration-150 group-hover:opacity-0">
        {title}
      </span>
      <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-[15px] font-semibold text-navy opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {hoverLabel}
      </span>
    </>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  const experiences = [
    { title: t("entrepreneurTitle"), hoverLabel: t("entrepreneurHover"), href: siteConfig.starterAppUrl },
    { title: t("businessTitle"), hoverLabel: t("businessHover"), href: siteConfig.businessLoginUrl },
  ];

  return (
    <>
      {/* NOTRE MÉTHODE */}
      <section className="relative overflow-hidden py-32 text-white sm:py-40">
        <VideoBackground src="/apropos-bg.mp4" />
        <div aria-hidden="true" className="absolute inset-0 bg-navy/70" />
        <div className="relative mx-auto max-w-[680px] px-5 text-center sm:px-8">
          <div className="mb-7 flex items-center justify-center gap-3">
            <span className="text-sm font-bold tracking-[0.16em] text-blue-light uppercase">
              {t("methodKicker")}
            </span>
          </div>

          <p className="mb-8 font-display text-[clamp(22px,2.6vw,28px)] leading-[1.35] text-white">
            {t("methodP1")}
          </p>
          <p className="mb-8 text-[17px] leading-relaxed text-white/72">{t("methodP2")}</p>
          <p className="mb-12 font-display text-lg font-medium text-blue-light">{t("methodP3")}</p>

          <Button href={siteConfig.methodologyUrl} variant="white">
            {t("methodCta")}
          </Button>
        </div>
      </section>

      {/* SLOGAN */}
      <section className="py-20">
        <div className="mx-auto max-w-[680px] px-5 text-center sm:px-8">
          <p className="font-display text-[clamp(26px,3.2vw,36px)] leading-tight text-navy">
            {t("slogan1")}
            <br />
            {t("slogan2")}
          </p>
        </div>
      </section>

      {/* CHOISISSEZ VOTRE EXPÉRIENCE */}
      <section className="relative overflow-hidden py-28 text-white sm:py-32">
        <VideoBackground src="/experience-bg.mp4" />
        <div aria-hidden="true" className="absolute inset-0 bg-navy/70" />
        <div className="relative mx-auto max-w-[1080px] px-5 sm:px-8">
          <div className="mx-auto mb-16 max-w-[560px] text-center">
            <h1 className="mb-4 font-display text-[clamp(30px,3.8vw,42px)] leading-tight text-white">
              {t("chooseTitle")}
            </h1>
            <p className="text-[16.5px] leading-relaxed text-white/72">{t("chooseText")}</p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row">
            {experiences.map((exp) => (
              <ExperienceTab
                key={exp.title}
                title={exp.title}
                hoverLabel={exp.hoverLabel}
                href={exp.href}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
