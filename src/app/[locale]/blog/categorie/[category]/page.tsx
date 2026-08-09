import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { POSTS_BY_CATEGORY_QUERY } from "@/sanity/queries";
import { BLOG_CATEGORY_SLUGS } from "@/lib/blog-categories";
import { routing } from "@/i18n/routing";

const DATE_LOCALES: Record<string, string> = { fr: "fr-FR", en: "en-US", nl: "nl-BE" };

type PostListItem = {
  _id: string;
  title: string;
  slug: { current: string };
  tag: string;
  excerpt: string;
  externalUrl?: string | null;
  publishedAt: string;
};

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(DATE_LOCALES[locale] ?? "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: `${t(`categories.${category}`)} — Blog Athenable` };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const label = t(`categories.${category}`);
  const posts = await client
    .fetch<PostListItem[]>(POSTS_BY_CATEGORY_QUERY, { category, language: locale })
    .catch(() => []);

  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:underline"
        >
          {t("backToBlog")}
        </Link>

        <h1 className="mb-3 font-display text-[clamp(28px,3.6vw,38px)] leading-tight text-navy">
          {label}
        </h1>
        <p className="mb-14 text-[16.5px] text-ink-muted">{t("categoryIntro")}</p>

        {posts.length === 0 ? (
          <p className="text-ink-muted">{t("categoryEmpty")}</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((post) => {
              const href = post.externalUrl ?? `/blog/${post.slug.current}`;
              const isExternal = Boolean(post.externalUrl);
              return (
                <a
                  key={post._id}
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group flex min-h-[260px] flex-col rounded-2xl border border-line bg-white p-7 transition-colors hover:border-blue"
                >
                  <div className="mb-4 text-xs font-bold tracking-[0.08em] text-blue uppercase">
                    {post.tag}
                  </div>
                  <h3 className="mb-2 font-display text-lg leading-tight font-bold text-navy">
                    {post.title}
                  </h3>
                  <p className="mb-3 text-[13px] text-ink-muted/70">
                    {formatDate(post.publishedAt, locale)}
                  </p>
                  <p className="flex-1 text-[14.5px] leading-relaxed text-ink-muted">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue group-hover:underline">
                    {isExternal ? t("readLinkedin") : t("readArticle")}
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    BLOG_CATEGORY_SLUGS.map((category) => ({ locale, category })),
  );
}
