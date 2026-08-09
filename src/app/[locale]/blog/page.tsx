import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AnnaConsole } from "@/components/anna-console";
import { BLOG_CATEGORY_SLUGS } from "@/lib/blog-categories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const categoryLabels = Object.fromEntries(
    BLOG_CATEGORY_SLUGS.map((slug) => [slug, t(`categories.${slug}`)]),
  );

  return (
    <section className="bg-[#eaf1fb] py-24 sm:py-28">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
        <AnnaConsole
          articleSoonLabel={t("articleSoon")}
          lastArticleLabel={t("lastArticle")}
          consultText={t("consultText")}
          categoryLabels={categoryLabels}
        />
      </div>
    </section>
  );
}
