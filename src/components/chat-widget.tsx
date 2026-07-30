"use client";

import { useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { AgentBall } from "@/components/agent-ball";
import { Facet } from "@/components/facet";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <>
      <AgentBall open={open} onClick={() => setOpen((v) => !v)} />

      {open && (
        <div className="fixed bottom-24 left-6 z-40 flex h-[480px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <Facet />
            <span className="font-display text-sm font-bold text-navy">Assistant Athenable</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <p className="text-[13.5px] leading-relaxed text-ink-muted">
                Posez-moi une question sur Athenable — notre méthode, nos offres, ou comment
                démarrer.
              </p>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
                    m.role === "user" ? "bg-blue text-white" : "bg-ice text-ink"
                  }`}
                >
                  {m.parts.map((part, i) =>
                    part.type === "text" ? <span key={i}>{part.text}</span> : null,
                  )}
                </div>
              </div>
            ))}

            {error && (
              <p className="text-[13.5px] text-red-600">
                Le chatbot n&apos;est pas encore configuré. Contactez-nous via le{" "}
                <a href="/contact" className="underline">
                  formulaire de contact
                </a>
                .
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-line p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre question..."
              disabled={isLoading}
              className="flex-1 rounded-lg border-[1.5px] border-line px-3 py-2 text-[14px] focus:border-blue"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-muted"
            >
              →
            </button>
          </form>
        </div>
      )}
    </>
  );
}
