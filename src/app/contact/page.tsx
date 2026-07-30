import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact — Athenable",
  description: "Prenez contact avec l'équipe Athenable.",
};

export default function ContactPage() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-[560px] px-5 sm:px-8">
        <h1 className="mb-4 font-display text-[clamp(28px,3.6vw,38px)] leading-tight text-navy">
          Prenez contact avec nous
        </h1>
        <p className="mb-10 text-[16.5px] leading-relaxed text-ink-muted">
          Une question, un rapport ESG à décortiquer, une envie de collaborer ? Écrivez-nous à{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-blue hover:underline">
            {siteConfig.email}
          </a>
          , via le formulaire ci-dessous, ou retrouvez-nous sur{" "}
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">
            LinkedIn
          </a>
          .
        </p>
        <ContactForm />
      </div>
    </section>
  );
}
