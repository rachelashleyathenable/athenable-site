import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-[560px] px-5 sm:px-8">
        <h1 className="mb-4 font-display text-[clamp(28px,3.6vw,38px)] leading-tight text-navy">
          {t("title")}
        </h1>
        <p className="mb-10 text-[16.5px] leading-relaxed text-ink-muted">
          {t("textBefore")}{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-blue hover:underline">
            {siteConfig.email}
          </a>
          {t("textMiddle")}{" "}
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue hover:underline"
          >
            {t("linkedin")}
          </a>
          .
        </p>
        <ContactForm />
      </div>
    </section>
  );
}
