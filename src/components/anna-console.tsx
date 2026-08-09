import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { BLOG_CATEGORY_SLUGS } from "@/lib/blog-categories";

export function AnnaConsole({
  articleSoonLabel,
  lastArticleLabel,
  consultText,
  categoryLabels,
}: {
  articleSoonLabel: string;
  lastArticleLabel: string;
  consultText: string;
  categoryLabels: Record<string, string>;
}) {
  return (
    <div className="mx-auto max-w-[560px]">
      <div className="overflow-hidden rounded-2xl shadow-xl">
        <Image
          src="/anna-screen.png"
          alt="Anna"
          width={820}
          height={622}
          className="w-full"
          priority
        />
      </div>

      <div className="group relative my-8 flex h-[110px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-line">
        <span className="text-[13px] font-medium text-ink-muted/50 transition-opacity duration-150 group-hover:opacity-0">
          {articleSoonLabel}
        </span>
        <span className="absolute inset-0 flex items-center justify-center bg-navy text-[14px] font-semibold text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {lastArticleLabel}
        </span>
      </div>

      <p className="mb-8 text-center text-[15px] leading-relaxed text-ink-muted">{consultText}</p>

      <div className="flex flex-col gap-3">
        {BLOG_CATEGORY_SLUGS.map((slug) => (
          <Link
            key={slug}
            href={`/blog/categorie/${slug}`}
            className="rounded-lg border-[1.5px] border-navy px-5 py-3.5 text-center text-[14px] font-semibold text-navy transition-colors hover:border-blue hover:bg-blue hover:text-white"
          >
            {categoryLabels[slug]}
          </Link>
        ))}
      </div>
    </div>
  );
}
