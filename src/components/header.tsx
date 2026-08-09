import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/button";
import { MobileNav } from "@/components/mobile-nav";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { navLinks, siteConfig } from "@/lib/site-config";

export async function Header() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/92 backdrop-blur-sm">
      <div className="relative mx-auto grid h-[76px] max-w-[1080px] grid-cols-[auto_1fr_auto] items-center px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3 justify-self-start">
          <Image
            src="/athenable-logo.png"
            alt={siteConfig.name}
            width={30}
            height={30}
            priority
          />
          <span className="font-display text-[17px] font-bold tracking-wide text-navy">
            {siteConfig.name.toUpperCase()}
          </span>
        </Link>

        <nav className="hidden items-center justify-self-center gap-16 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-ink hover:text-blue"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 justify-self-end md:flex">
          <LocaleSwitcher />
          <Button href={siteConfig.calendly} variant="ghost" className="!px-5 !py-2.5 !text-sm">
            {t("start")}
          </Button>
        </div>

        <div className="col-start-3 justify-self-end md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
