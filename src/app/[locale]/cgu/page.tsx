import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.cgu" });
  return { title: t("metaTitle") };
}

export default async function CguPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.cgu");

  return (
    <div className="mx-auto max-w-[720px] px-5 py-24 sm:px-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-navy">{t("title")}</h1>
      <div className="space-y-8 text-[15.5px] leading-relaxed text-ink-muted">
        <p>
          {t("introBefore")}{" "}
          <Link href="/mentions-legales" className="text-blue hover:underline">
            {t("introLink")}
          </Link>
          .
        </p>

        <div>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">{t("s1Title")}</h2>
          <p>{t("s1Text")}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">{t("s2Title")}</h2>
          <p>
            {t("s2TextBefore")}{" "}
            <Link href="/confidentialite" className="text-blue hover:underline">
              {t("s2Link")}
            </Link>
            . {t("s2TextAfter")}
          </p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">{t("s3Title")}</h2>
          <p>{t("s3Text")}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">{t("s4Title")}</h2>
          <p>{t("s4Text")}</p>
        </div>

        <div>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">{t("s5Title")}</h2>
          <p>{t("s5Text")}</p>
        </div>
      </div>
    </div>
  );
}
