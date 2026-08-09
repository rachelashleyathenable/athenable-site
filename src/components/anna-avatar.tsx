type AnnaAvatarProps = {
  size?: number;
  className?: string;
};

export function AnnaAvatar({ size = 16, className = "" }: AnnaAvatarProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="anna-avatar-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3f7cc9" />
          <stop offset="100%" stopColor="#0b2447" />
        </linearGradient>
      </defs>
      <circle cx="8" cy="8" r="8" fill="url(#anna-avatar-gradient)" />
      <text
        x="8"
        y="8.6"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-display, sans-serif)"
        fontWeight={700}
        fontSize="9"
        fill="#ffffff"
      >
        A
      </text>
    </svg>
  );
}
