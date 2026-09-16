import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { VideoBackground } from "@/components/video-background";
import { ClientConnect } from "@/components/client-connect";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "enterprise" });
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

export default async function ClientConnexionPage({
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
        <div className="mx-auto mb-8 max-w-[480px]">
          <Link
            href="/entreprise"
            className="text-sm font-medium text-white/70 hover:text-white"
          >
            ← {t("back")}
          </Link>
        </div>
        <ClientConnect />
      </div>
    </section>
  );
}
