"use client";

import { Link } from "@/i18n/navigation";
import type { MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "ghost" | "ghost-invert" | "white";

type ButtonProps = {
  href?: string;
  onClick?: MouseEventHandler;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-[#2670c7]",
  ghost: "border-[1.5px] border-navy text-navy hover:bg-navy hover:text-white",
  "ghost-invert":
    "border-[1.5px] border-white/35 text-white hover:border-white hover:bg-white/10",
  white: "bg-white text-navy hover:bg-ice",
};

export function Button({
  href,
  onClick,
  variant = "primary",
  className = "",
  children,
  type = "button",
  disabled,
}: ButtonProps) {
  const classes = `inline-flex items-center gap-2 rounded-lg px-7 py-4 text-[15px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`;

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          onClick={onClick}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
