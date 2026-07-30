"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
};

export function Modal({ onClose, children, labelledBy }: ModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-2xl animate-[fadein_0.2s_ease] rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          aria-label="Fermer"
          onClick={onClose}
          className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white shadow-md hover:bg-blue"
        >
          ✕
        </button>
        <div className="max-h-[85vh] overflow-y-auto p-2 sm:p-4">{children}</div>
      </div>
    </div>
  );
}
