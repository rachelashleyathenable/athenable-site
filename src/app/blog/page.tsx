import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/client";
import { POSTS_QUERY } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Blog — Athenable",
  description:
    "Nos opportunités de la semaine : ce que les rapports ESG révèlent sur les besoins business des entreprises.",
};

export const revalidate = 60;

type PostListItem = {
  _id: string;
  title: string;
  slug: { current: string };
  tag: string;
  excerpt: string;
  externalUrl?: string | null;
  publishedAt: string;
};

export default async function BlogPage() {
  const posts = await client.fetch<PostListItem[]>(POSTS_QUERY).catch(() => []);

  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
        <div className="mb-14 max-w-[620px]">
          <h1 className="mb-3 font-display text-[clamp(28px,3.6vw,38px)] leading-tight text-navy">
            Nos opportunités de la semaine
          </h1>
          <p className="text-[16.5px] text-ink-muted">
            Un rapport ESG n&apos;est jamais qu&apos;une liste d&apos;engagements. C&apos;est la
            carte de ce dont une entreprise a besoin, mais qu&apos;elle n&apos;a pas encore trouvé.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-ink-muted">
            Aucun post pour le moment — ajoutez-en depuis{" "}
            <Link href="/studio" className="text-blue hover:underline">
              le Studio
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((post) => {
              const href = post.externalUrl ?? `/blog/${post.slug.current}`;
              const isExternal = Boolean(post.externalUrl);
              return (
                <div
                  key={post._id}
                  className="flex min-h-[300px] flex-col rounded-2xl bg-navy p-7 text-white"
                >
                  <div className="mb-4 text-xs font-bold tracking-[0.08em] text-blue-light uppercase">
                    {post.tag}
                  </div>
                  <h3 className="mb-3.5 font-display text-xl leading-tight font-bold">
                    {post.title}
                  </h3>
                  <p className="flex-1 text-[14.5px] text-white/68">{post.excerpt}</p>
                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-light hover:underline"
                  >
                    {isExternal ? "Lire le post sur LinkedIn →" : "Lire l'article →"}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
