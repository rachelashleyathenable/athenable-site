type FacetProps = {
  tone?: "default" | "on-navy";
  className?: string;
};

export function Facet({ tone = "default", className = "" }: FacetProps) {
  const inner = tone === "on-navy" ? "#123468" : "#0b2447";

  return (
    <svg
      viewBox="0 0 16 16"
      width={16}
      height={16}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <polygon points="8,0 16,8 8,16 0,8" fill="#1b5fad" />
      <polygon points="8,4 12,8 8,12 4,8" fill={inner} />
    </svg>
  );
}
