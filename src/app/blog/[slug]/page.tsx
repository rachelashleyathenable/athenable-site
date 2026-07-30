import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/client";
import { POST_QUERY } from "@/sanity/queries";

export const revalidate = 60;

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(POST_QUERY, { slug }).catch(() => null);
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(POST_QUERY, { slug }).catch(() => null);

  if (!post) notFound();

  return (
    <article className="py-24 sm:py-28">
      <div className="mx-auto max-w-[680px] px-5 sm:px-8">
        <div className="mb-4 text-xs font-bold tracking-[0.08em] text-blue uppercase">
          {post.tag}
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
            Lire le post complet sur LinkedIn →
          </a>
        ) : null}
      </div>
    </article>
  );
}
