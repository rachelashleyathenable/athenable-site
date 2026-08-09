"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Facet } from "@/components/facet";

type PollState = {
  pillar: string | null;
  maturity: string | null;
  role: string | null;
  besoin: string | null;
  prenom: string;
  email: string;
};

const initialState: PollState = {
  pillar: null,
  maturity: null,
  role: null,
  besoin: null,
  prenom: "",
  email: "",
};

const STEP_DEFS = [
  {
    key: "pillar" as const,
    questionKey: "step1Question",
    options: [
      { value: "opportunites", labelKey: "step1Opportunites" },
      { value: "analyse", labelKey: "step1Analyse" },
      { value: "temoignages", labelKey: "step1Temoignages" },
      { value: "demos", labelKey: "step1Demos" },
    ],
  },
  {
    key: "maturity" as const,
    questionKey: "step2Question",
    options: [
      { value: "debut", labelKey: "step2Debut" },
      { value: "reporting", labelKey: "step2Reporting" },
      { value: "cherche_valeur", labelKey: "step2ChercheValeur" },
      { value: "mature", labelKey: "step2Mature" },
    ],
  },
  {
    key: "role" as const,
    questionKey: "step3Question",
    options: [
      { value: "dirigeant", labelKey: "step3Dirigeant" },
      { value: "rse", labelKey: "step3Rse" },
      { value: "consultant", labelKey: "step3Consultant" },
      { value: "autre", labelKey: "step3Autre" },
    ],
  },
  {
    key: "besoin" as const,
    questionKey: "step4Question",
    options: [
      { value: "structurer", labelKey: "step4Structurer" },
      { value: "opportunites_business", labelKey: "step4OpportunitesBusiness" },
      { value: "valoriser", labelKey: "step4Valoriser" },
      { value: "autre_besoin", labelKey: "step4Autre" },
    ],
  },
];

const totalSteps = STEP_DEFS.length + 1;

export function Poll() {
  const t = useTranslations("quiz");
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<PollState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const isCaptureStep = currentStep === totalSteps;

  const pillarCopy: Record<string, { tag: string; text: string }> = {
    opportunites: { tag: t("pillarOpportunitesTag"), text: t("pillarOpportunitesText") },
    analyse: { tag: t("pillarAnalyseTag"), text: t("pillarAnalyseText") },
    temoignages: { tag: t("pillarTemoignagesTag"), text: t("pillarTemoignagesText") },
    demos: { tag: t("pillarDemosTag"), text: t("pillarDemosText") },
  };

  function selectOption(key: (typeof STEP_DEFS)[number]["key"], value: string) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function canGoNext() {
    if (isCaptureStep) {
      return Boolean(state.prenom.trim() && state.email.includes("@"));
    }
    const step = STEP_DEFS[currentStep - 1];
    return Boolean(state[step.key]);
  }

  async function handleNext() {
    if (!isCaptureStep) {
      setCurrentStep((s) => s + 1);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    const copy = pillarCopy[state.pillar ?? "opportunites"];
    return (
      <div className="py-6 text-center">
        <Facet className="mx-auto mb-5 h-8 w-8" />
        <div className="mb-5 inline-block rounded-full bg-navy px-4 py-2 text-xs font-bold tracking-wide text-white uppercase">
          {copy.tag}
        </div>
        <h3 className="mb-3 font-display text-2xl font-bold text-navy">
          {state.prenom ? t("thanksWithName", { name: state.prenom }) : t("thanksPlain")}
        </h3>
        <p className="mx-auto max-w-md text-[15.5px] text-ink-muted">{copy.text}</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="mb-8 flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < currentStep ? "bg-blue" : "bg-line"
            }`}
          />
        ))}
      </div>

      {!isCaptureStep ? (
        <div>
          <div className="mb-6 font-display text-xl font-bold text-navy">
            {t(STEP_DEFS[currentStep - 1].questionKey)}
          </div>
          <div className="flex flex-col gap-2.5">
            {STEP_DEFS[currentStep - 1].options.map((opt) => {
              const selected = state[STEP_DEFS[currentStep - 1].key] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => selectOption(STEP_DEFS[currentStep - 1].key, opt.value)}
                  className={`flex w-full items-center gap-3.5 rounded-[10px] border-[1.5px] px-[18px] py-4 text-left text-[15.5px] font-medium transition-colors ${
                    selected
                      ? "border-blue bg-blue/[0.07]"
                      : "border-line bg-white hover:border-blue hover:bg-blue/[0.04]"
                  }`}
                >
                  <Facet className={selected ? "opacity-100" : "opacity-50"} />
                  {t(opt.labelKey)}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 font-display text-xl font-bold text-navy">
            {t("captureTitle")}
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder={t("firstNamePlaceholder")}
              autoComplete="given-name"
              value={state.prenom}
              onChange={(e) => setState((s) => ({ ...s, prenom: e.target.value }))}
              className="rounded-lg border-[1.5px] border-line px-4 py-3.5 text-[15px] focus:border-blue"
            />
            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              value={state.email}
              onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
              className="rounded-lg border-[1.5px] border-line px-4 py-3.5 text-[15px] focus:border-blue"
            />
          </div>
          {status === "error" && (
            <p className="mt-3 text-sm text-red-600">{t("error")}</p>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
          className={`text-sm font-semibold text-ink-muted ${currentStep === 1 ? "invisible" : ""}`}
        >
          {t("prevBtn")}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext() || status === "submitting"}
          className="rounded-lg bg-navy px-6 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-muted"
        >
          {status === "submitting"
            ? t("sendingBtn")
            : isCaptureStep
              ? t("seeProfileBtn")
              : t("nextBtn")}
        </button>
      </div>
    </div>
  );
}
