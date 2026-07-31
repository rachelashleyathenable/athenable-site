import Link from "next/link";

const adminNavLinks = [
  { href: "/admin/seo", label: "Vue d'ensemble" },
  { href: "/admin/seo/articles", label: "Articles" },
  { href: "/admin/seo/keywords", label: "Mots-clés" },
  { href: "/admin/seo/ads", label: "Ads" },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1080px] px-5 py-10 sm:px-8">
      <div className="mb-8 flex items-center justify-between border-b border-line pb-5">
        <h1 className="font-display text-xl font-bold text-navy">SEO Athenable — Admin</h1>
        <nav className="flex gap-5">
          {adminNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-[14px] font-medium text-ink hover:text-blue">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
