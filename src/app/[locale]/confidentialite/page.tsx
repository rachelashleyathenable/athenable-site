import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.confidentialite" });
  return { title: t("metaTitle") };
}

export default async function ConfidentialitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.confidentialite");

  return (
    <div className="mx-auto max-w-[720px] px-5 py-24 sm:px-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-navy">{t("title")}</h1>
      <div className="space-y-8 text-[15.5px] leading-relaxed text-ink-muted">
        <div>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">{t("dataTitle")}</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>{t("dataQuizLabel")}</strong> {t("dataQuizText")}
            </li>
            <li>
              <strong>{t("dataContactLabel")}</strong> {t("dataContactText")}
            </li>
            <li>
              <strong>{t("dataChatLabel")}</strong> {t("dataChatText")}
            </li>
            <li>
              <strong>{t("dataAnalyticsLabel")}</strong> {t("dataAnalyticsText")}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">
            {t("legalBasisTitle")}
          </h2>
          <p>{t("legalBasisText")}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">{t("hostingTitle")}</h2>
          <p>{t("hostingText")}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">{t("rightsTitle")}</h2>
          <p>
            {t("rightsTextBefore")}{" "}
            <a href="mailto:rachel@athenable.app" className="text-blue hover:underline">
              rachel@athenable.app
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
