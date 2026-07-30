import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa6";
import { siteConfig } from "@/lib/site-config";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
  { href: "/cgu", label: "CGU" },
];

const socialLinks = [
  { href: siteConfig.linkedin, label: "LinkedIn", Icon: FaLinkedin },
  { href: siteConfig.instagram, label: "Instagram", Icon: FaInstagram },
  { href: siteConfig.youtube, label: "YouTube", Icon: FaYoutube },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-on-navy bg-navy text-white/60">
      <div className="mx-auto max-w-[1080px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/athenable-logo.png"
                alt={siteConfig.name}
                width={28}
                height={28}
                className="brightness-0 invert"
              />
              <span className="font-display text-[16px] font-bold text-white">
                {siteConfig.name.toUpperCase()}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">{siteConfig.tagline}</p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Légal</h3>
            <ul className="space-y-3 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Suivez-nous</h3>
            <ul className="space-y-3 text-sm">
              {socialLinks.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <Icon size={16} aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-line-on-navy pt-8 text-sm">
          © {year} {siteConfig.name}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
