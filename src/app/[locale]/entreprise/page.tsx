import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { VideoBackground } from "@/components/video-background";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "enterprise" });
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

const cardClass =
  "group flex flex-col rounded-xl border border-line bg-white p-7 text-left shadow-sm transition-colors duration-150 hover:border-navy";

export default async function EnterprisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("enterprise");

  return (
    <section className="relative overflow-hidden py-28 sm:py-32">
      <VideoBackground src="/experience-bg.mp4" />
      <div aria-hidden="true" className="absolute inset-0 bg-navy/80" />
      <div className="relative mx-auto max-w-[1080px] px-5 sm:px-8">
        <div className="mx-auto mb-12 max-w-[560px] text-center text-white">
          <h1 className="mb-4 font-display text-[clamp(30px,3.8vw,42px)] leading-tight">
            {t("title")}
          </h1>
          <p className="text-[16.5px] leading-relaxed text-white/72">
            {t("subtitle")}
          </p>
        </div>

        <div className="mx-auto grid max-w-[800px] gap-6 sm:grid-cols-2">
          <Link href="/entreprise/connexion" className={cardClass}>
            <h2 className="mb-2 font-display text-xl font-bold text-navy">
              {t("clientCardTitle")}
            </h2>
            <p className="mb-6 flex-1 text-[15px] leading-relaxed text-ink-muted">
              {t("clientCardText")}
            </p>
            <span className="text-sm font-semibold text-blue group-hover:underline">
              {t("clientCardCta")} →
            </span>
          </Link>

          <a
            href={siteConfig.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className={cardClass}
          >
            <h2 className="mb-2 font-display text-xl font-bold text-navy">
              {t("prospectCardTitle")}
            </h2>
            <p className="mb-6 flex-1 text-[15px] leading-relaxed text-ink-muted">
              {t("prospectCardText")}
            </p>
            <span className="text-sm font-semibold text-blue group-hover:underline">
              {t("prospectCardCta")} →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
