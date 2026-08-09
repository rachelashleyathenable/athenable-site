import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PortableText } from "@portabletext/react";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { POST_QUERY } from "@/sanity/queries";
import { Button } from "@/components/button";
import { siteConfig } from "@/lib/site-config";

const DATE_LOCALES: Record<string, string> = { fr: "fr-FR", en: "en-US", nl: "nl-BE" };

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  tag: string;
  excerpt: string;
  externalUrl?: string | null;
  body?: unknown[];
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
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await client
    .fetch<Post | null>(POST_QUERY, { slug, language: locale })
    .catch(() => null);
  if (!post) return { title: "Athenable" };
  return {
    title: `${post.title} — Athenable`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const post = await client
    .fetch<Post | null>(POST_QUERY, { slug, language: locale })
    .catch(() => null);

  if (!post) notFound();

  return (
    <>
      <article className="py-24 sm:py-28">
        <div className="mx-auto max-w-[680px] px-5 sm:px-8">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:underline"
          >
            {t("backToBlog")}
          </Link>

          <div className="mb-4 flex items-center gap-3 text-xs font-bold tracking-[0.08em] text-blue uppercase">
            <span>{post.tag}</span>
            <span className="text-ink-muted/40">·</span>
            <span className="font-normal tracking-normal text-ink-muted/70 normal-case">
              {formatDate(post.publishedAt, locale)}
            </span>
          </div>
          <h1 className="mb-6 font-display text-[clamp(28px,3.6vw,38px)] leading-tight text-navy">
            {post.title}
          </h1>
          <p className="mb-10 text-[17px] leading-relaxed text-ink-muted">{post.excerpt}</p>

          {post.body ? (
            <div className="prose prose-neutral max-w-none text-[16px] leading-relaxed text-ink">
              <PortableText value={post.body as never} />
            </div>
          ) : post.externalUrl ? (
            <a
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue hover:underline"
            >
              {t("readLinkedin")}
            </a>
          ) : null}
        </div>
      </article>

      {/* CTA */}
      <section className="bg-ice py-20 sm:py-24">
        <div className="mx-auto max-w-[600px] px-5 text-center sm:px-8">
          <h2 className="mb-3 font-display text-2xl font-bold text-navy">{t("ctaTitle")}</h2>
          <p className="mb-8 text-[15.5px] leading-relaxed text-ink-muted">{t("ctaText")}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={siteConfig.calendly} variant="primary">
              {t("ctaStart")}
            </Button>
            <Button href={siteConfig.communityUrl} variant="ghost">
              {t("ctaCommunity")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
