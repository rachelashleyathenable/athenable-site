"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { Poll } from "@/components/poll";

export function QuizModalTrigger({
  label,
  variant = "primary",
}: {
  label: string;
  variant?: "primary" | "ghost" | "ghost-invert";
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("quiz");

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && (
        <Modal onClose={() => setOpen(false)} labelledBy="quiz-modal-title">
          <div className="p-5 sm:p-7">
            <h2 id="quiz-modal-title" className="sr-only">
              {t("srTitle")}
            </h2>
            <Poll />
          </div>
        </Modal>
      )}
    </>
  );
}
