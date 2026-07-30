"use client";

import { useState } from "react";
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

const steps = [
  {
    key: "pillar" as const,
    question: "Quel type de contenu vous parle le plus ?",
    options: [
      { value: "opportunites", label: "Les opportunités cachées dans un rapport ESG" },
      { value: "analyse", label: "L'analyse de l'actualité d'une entreprise" },
      { value: "temoignages", label: "Les témoignages et retours d'expérience" },
      { value: "demos", label: "Voir un résultat concret en action" },
    ],
  },
  {
    key: "maturity" as const,
    question: "Où en êtes-vous avec l'ESG aujourd'hui ?",
    options: [
      { value: "debut", label: "On démarre tout juste" },
      { value: "reporting", label: "On fait du reporting, sans plus" },
      { value: "cherche_valeur", label: "On cherche à en tirer de la valeur business" },
      { value: "mature", label: "On est déjà avancés sur le sujet" },
    ],
  },
  {
    key: "role" as const,
    question: "Vous êtes plutôt...",
    options: [
      { value: "dirigeant", label: "Dirigeant·e / fondateur·rice" },
      { value: "rse", label: "Responsable RSE / ESG" },
      { value: "consultant", label: "Consultant·e" },
      { value: "autre", label: "Autre" },
    ],
  },
  {
    key: "besoin" as const,
    question: "Quel est votre besoin principal aujourd'hui ?",
    options: [
      { value: "structurer", label: "Structurer notre démarche ESG" },
      { value: "opportunites_business", label: "Identifier de nouvelles opportunités business" },
      { value: "valoriser", label: "Valoriser et communiquer nos résultats ESG" },
      { value: "autre_besoin", label: "Autre besoin" },
    ],
  },
];

const pillarCopy: Record<string, { tag: string; title: string; text: string }> = {
  opportunites: {
    tag: "Profil : chasseur d'opportunités",
    title: "On vous envoie ça direct.",
    text: 'Vous recevrez en priorité nos décryptages "3 opportunités cachées dans un rapport ESG", chaque vendredi.',
  },
  analyse: {
    tag: "Profil : veille stratégique",
    title: "Parfait, on a ce qu'il vous faut.",
    text: "On vous enverra nos analyses d'actualités d'entreprises, avec ce que la plupart des gens ne voient pas.",
  },
  temoignages: {
    tag: "Profil : preuve par l'exemple",
    title: "Vous allez aimer nos interviews.",
    text: "On vous partage les meilleures histoires d'opportunités business trouvées grâce à des projets ESG.",
  },
  demos: {
    tag: "Profil : orienté résultat",
    title: "On vous montre, pas on vous raconte.",
    text: "On vous enverra nos démos concrètes : rapport en main, résultat en 5 minutes.",
  },
};

const totalSteps = steps.length + 1;

export function Poll() {
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<PollState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const isCaptureStep = currentStep === totalSteps;

  function selectOption(key: (typeof steps)[number]["key"], value: string) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function canGoNext() {
    if (isCaptureStep) {
      return Boolean(state.prenom.trim() && state.email.includes("@"));
    }
    const step = steps[currentStep - 1];
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
          {state.prenom ? `${state.prenom}, m` : "M"}erci !
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
            {steps[currentStep - 1].question}
          </div>
          <div className="flex flex-col gap-2.5">
            {steps[currentStep - 1].options.map((opt) => {
              const selected = state[steps[currentStep - 1].key] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => selectOption(steps[currentStep - 1].key, opt.value)}
                  className={`flex w-full items-center gap-3.5 rounded-[10px] border-[1.5px] px-[18px] py-4 text-left text-[15.5px] font-medium transition-colors ${
                    selected
                      ? "border-blue bg-blue/[0.07]"
                      : "border-line bg-white hover:border-blue hover:bg-blue/[0.04]"
                  }`}
                >
                  <Facet className={selected ? "opacity-100" : "opacity-50"} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 font-display text-xl font-bold text-navy">
            Recevez nos opportunités chaque semaine
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Prénom"
              autoComplete="given-name"
              value={state.prenom}
              onChange={(e) => setState((s) => ({ ...s, prenom: e.target.value }))}
              className="rounded-lg border-[1.5px] border-line px-4 py-3.5 text-[15px] focus:border-blue"
            />
            <input
              type="email"
              placeholder="Email professionnel"
              autoComplete="email"
              value={state.email}
              onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
              className="rounded-lg border-[1.5px] border-line px-4 py-3.5 text-[15px] focus:border-blue"
            />
          </div>
          {status === "error" && (
            <p className="mt-3 text-sm text-red-600">
              Une erreur est survenue, réessayez dans quelques instants.
            </p>
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
          ← Précédent
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext() || status === "submitting"}
          className="rounded-lg bg-navy px-6 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-muted"
        >
          {status === "submitting"
            ? "Envoi..."
            : isCaptureStep
              ? "Voir mon profil →"
              : "Suivant →"}
        </button>
      </div>
    </div>
  );
}
