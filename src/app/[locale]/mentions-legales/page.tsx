import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.mentions" });
  return { title: t("metaTitle") };
}

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.mentions");

  return (
    <div className="mx-auto max-w-[720px] px-5 py-24 sm:px-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-navy">{t("title")}</h1>
      <div className="space-y-6 text-[15.5px] leading-relaxed text-ink-muted">
        <p>{t("editor")}</p>
        <p>{t("address")}</p>
        <p>{t("director")}</p>
        <p>{t("hosting")}</p>
        <p>
          {t("contact")}{" "}
          <a href="mailto:rachel@athenable.app" className="text-blue hover:underline">
            rachel@athenable.app
          </a>
          .
        </p>
      </div>
    </div>
  );
}
