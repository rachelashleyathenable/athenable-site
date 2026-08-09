import { getWriteClient } from "@/sanity/write-client";
import { siteConfig } from "@/lib/site-config";
import { GenerateArticleForm } from "@/components/generate-article-form";

export const dynamic = "force-dynamic";

type DraftPost = {
  _id: string;
  title: string;
  focusKeyword?: string;
  metaDescription?: string;
  generatedAt?: string;
};

async function getDrafts(): Promise<{ drafts: DraftPost[] | null; error: string | null }> {
  try {
    const drafts = await getWriteClient().fetch<DraftPost[]>(
      `*[_type == "post" && aiGenerated == true && _id in path("drafts.**")]{
        _id, title, focusKeyword, metaDescription, "generatedAt": aiMeta.generatedAt
      } | order(generatedAt desc)`,
    );
    return { drafts, error: null };
  } catch {
    return { drafts: null, error: "SANITY_API_TOKEN non configuré — impossible de lister les brouillons." };
  }
}

export default async function ArticlesPage() {
  const { drafts, error } = await getDrafts();
  const studioBase = new URL("/studio", siteConfig.siteUrl).pathname;

  return (
    <div>
      <GenerateArticleForm />

      {error && <p className="text-ink-muted">{error}</p>}

      {drafts && drafts.length === 0 && <p className="text-ink-muted">Aucun brouillon IA en attente.</p>}

      {drafts && drafts.length > 0 && (
        <div className="flex flex-col gap-3">
          {drafts.map((post) => (
            <div key={post._id} className="rounded-xl border border-line p-5">
              <h3 className="font-display text-base font-bold text-navy">{post.title}</h3>
              {post.focusKeyword && (
                <p className="mt-1 text-[13px] text-ink-muted">Mot-clé : {post.focusKeyword}</p>
              )}
              {post.metaDescription && (
                <p className="mt-1 text-[13.5px] text-ink-muted">{post.metaDescription}</p>
              )}
              <a
                href={`${studioBase}/intent/edit/id=${post._id};type=post`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-blue hover:underline"
              >
                Relire et publier dans Sanity Studio →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
