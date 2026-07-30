"use client";

import { useState } from "react";

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("done");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-line bg-ice p-8 text-center">
        <p className="font-display text-lg font-bold text-navy">Message envoyé !</p>
        <p className="mt-2 text-[15px] text-ink-muted">On vous répond au plus vite.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        required
        placeholder="Nom"
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        className="rounded-lg border-[1.5px] border-line px-4 py-3.5 text-[15px] focus:border-blue"
      />
      <input
        type="email"
        required
        placeholder="Email"
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        className="rounded-lg border-[1.5px] border-line px-4 py-3.5 text-[15px] focus:border-blue"
      />
      <textarea
        required
        rows={5}
        placeholder="Votre message"
        value={values.message}
        onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
        className="resize-none rounded-lg border-[1.5px] border-line px-4 py-3.5 text-[15px] focus:border-blue"
      />
      {status === "error" && (
        <p className="text-sm text-red-600">Une erreur est survenue, réessayez.</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start rounded-lg bg-navy px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "submitting" ? "Envoi..." : "Envoyer →"}
      </button>
    </form>
  );
}
