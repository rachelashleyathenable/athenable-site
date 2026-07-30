import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { MobileNav } from "@/components/mobile-nav";
import { navLinks, siteConfig } from "@/lib/site-config";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/92 backdrop-blur-sm">
      <div className="relative mx-auto flex h-[76px] max-w-[1080px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
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

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-ink hover:text-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href={siteConfig.calendly} variant="ghost" className="!px-5 !py-2.5 !text-sm">
            Commencer
          </Button>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
