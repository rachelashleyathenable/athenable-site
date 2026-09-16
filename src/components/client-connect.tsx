"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/button";

// Écran de l'espace client (page /entreprise/connexion) : d'abord un accueil
// avec un bouton "Se connecter", puis la saisie du seul code d'accès.
export function ClientConnect() {
  const t = useTranslations("enterprise");
  const [step, setStep] = useState<"welcome" | "code">("welcome");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorKey, setErrorKey] = useState<"errorInvalid" | "errorGeneric">(
    "errorInvalid",
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/client/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        const data = (await res.json()) as { redirect?: string };
        window.location.href = data.redirect ?? "/";
        return;
      }
      setErrorKey(res.status === 401 ? "errorInvalid" : "errorGeneric");
      setStatus("error");
    } catch {
      setErrorKey("errorGeneric");
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-[480px] rounded-xl border border-line bg-white p-8 shadow-sm">
      {step === "welcome" ? (
        <div className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-2xl font-bold text-navy">
            {t("welcomeTitle")}
          </h2>
          <p className="text-[16px] leading-relaxed text-ink-muted">
            {t("welcomeText")}
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={() => setStep("code")}
            className="mt-2"
          >
            {t("connectCta")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {t("codeIntro")}
          </p>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-navy">
              {t("codeLabel")}
            </span>
            <input
              type="text"
              autoComplete="one-time-code"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="NOVA-XXXX-XXXX-XXXX"
              className="rounded-lg border border-line bg-ice px-4 py-3 text-[15px] tracking-wide text-ink outline-none focus:border-blue"
            />
          </label>

          {status === "error" && (
            <p role="alert" className="text-sm font-medium text-[#c0392b]">
              {t(errorKey)}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={status === "loading"}>
            {status === "loading" ? t("submitting") : t("submit")}
          </Button>
        </form>
      )}
    </div>
  );
}
