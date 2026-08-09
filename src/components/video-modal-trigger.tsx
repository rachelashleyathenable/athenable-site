"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { siteConfig } from "@/lib/site-config";

export function VideoModalTrigger({
  label,
  variant = "primary",
}: {
  label: string;
  variant?: "primary" | "ghost" | "ghost-invert";
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("videoModal");

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && (
        <Modal onClose={() => setOpen(false)} labelledBy="video-modal-title">
          <h2 id="video-modal-title" className="sr-only">
            {t("srTitle")}
          </h2>
          {siteConfig.demoVideoId ? (
            <div className="aspect-video w-full overflow-hidden rounded-xl">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${siteConfig.demoVideoId}?autoplay=1`}
                title={t("srTitle")}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl bg-ice p-8 text-center">
              <p className="font-display text-lg font-bold text-navy">{t("comingSoonTitle")}</p>
              <p className="max-w-sm text-sm text-ink-muted">{t("comingSoonText")}</p>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
