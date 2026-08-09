import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { VideoBackground } from "@/components/video-background";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("metaTitle") };
}

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <section className="relative overflow-hidden py-28 text-white sm:py-36">
        <VideoBackground src="/apropos-bg.mp4" />
        <div aria-hidden="true" className="absolute inset-0 bg-navy/70" />
        <div className="relative mx-auto max-w-[720px] px-5 text-center sm:px-8">
          <h1 className="mb-4 font-display text-[clamp(34px,5vw,56px)] leading-[1.08] text-white">
            {t("title")}
          </h1>
          <h2 className="mb-14 font-display text-[clamp(20px,2.4vw,26px)] font-medium text-blue-light">
            {t("subtitle")}
          </h2>

          <div className="mx-auto max-w-[620px] space-y-7 text-left text-[17px] leading-relaxed text-white/72">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
          </div>
        </div>
      </section>

      <section className="py-32 sm:py-40">
        <div className="mx-auto max-w-[960px] px-5 sm:px-8">
          <h2 className="mb-10 text-center font-display text-[clamp(24px,3vw,32px)] text-navy">
            {t("visionTitle")}
          </h2>

          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-ice">
            {siteConfig.visionVideoId ? (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${siteConfig.visionVideoId}`}
                title={t("visionTitle")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-sm text-ink-muted">{t("videoSoon")}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
