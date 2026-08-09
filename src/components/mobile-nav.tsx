"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navLinks } from "@/lib/site-config";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const tMobile = useTranslations("mobileNav");

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? tMobile("close") : tMobile("open")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`block h-0.5 w-6 bg-navy transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span className={`block h-0.5 w-6 bg-navy transition-opacity ${open ? "opacity-0" : ""}`} />
        <span
          className={`block h-0.5 w-6 bg-navy transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-line bg-white/95 backdrop-blur-sm">
          <nav className="flex flex-col gap-1 px-5 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-[15px] font-medium text-navy hover:bg-ice"
              >
                {t(link.key)}
              </Link>
            ))}
            <div className="px-3 py-3">
              <LocaleSwitcher />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
