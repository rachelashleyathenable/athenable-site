export function AgentBall({
  onClick,
  open,
}: {
  onClick?: () => void;
  open?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Fermer l'assistant Athenable" : "Ouvrir l'assistant Athenable"}
      title={open ? "Fermer l'assistant Athenable" : "Ouvrir l'assistant Athenable"}
      className="fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center transition-transform hover:scale-105"
    >
      <span className="relative block h-full w-full">
        {/* sphere */}
        <span
          className="relative block h-full w-full overflow-hidden rounded-full border-2 border-navy"
          style={{ boxShadow: "inset 0 -6px 10px rgba(11,36,71,0.35), 0 4px 10px rgba(11,36,71,0.35)" }}
        >
          <span
            className="absolute inset-x-0 top-0 h-[46%]"
            style={{ background: "linear-gradient(160deg, #3f7cc9 0%, #0b2447 75%)" }}
          />
          <span className="absolute inset-x-0 top-[46%] h-[14%] -translate-y-1/2 bg-navy" />
          <span
            className="absolute inset-x-0 bottom-0 h-[40%]"
            style={{ background: "linear-gradient(340deg, #eef2f8 0%, #ffffff 70%)" }}
          />

          {/* glossy highlight */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 32% 22%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 42%)",
            }}
          />

          <span className="absolute top-1/2 left-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-navy bg-white shadow-[inset_0_1px_2px_rgba(11,36,71,0.3)]">
            <span className="h-1.5 w-1.5 rounded-full bg-blue" />
          </span>
        </span>
      </span>
    </button>
  );
}
