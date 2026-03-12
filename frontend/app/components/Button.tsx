"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Loading Spinner ─────────────────────────────────────────────────────────

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 20"
      width="1em"
      height="1em"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="10"
        cy="10"
        r="8"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M10 2a8 8 0 0 1 7.94 7h-2.02A6 6 0 1 0 10 16v2a8 8 0 0 1 0-16Z"
      />
    </svg>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

// Pipo design system colors (from Figma):
//   Green scale:  5=#00A750  6=#008640  7=#006430  8=#004320
//   Clean Grey:   5=#E4E5E0  3=#EFEFEC
//   Form Grey:    5=#6F6F6F

const base = [
  "inline-flex justify-center gap-[6px]",
  "font-bold uppercase",
  "rounded-[6px] cursor-pointer select-none",
  "transition-colors duration-150",
  "focus:outline-none",
  "disabled:cursor-not-allowed",
].join(" ");

const variants = {
  primary: cn(
    // default
    "bg-[#00A750] text-[#E4E5E0]",
    // hover
    "hover:bg-[#006430]",
    // pressed/active
    "active:bg-[#008640]",
    // focus
    "focus-visible:ring-2 focus-visible:ring-[#004320] focus-visible:ring-offset-2",
    // disabled
    "disabled:bg-[#E4E5E0] disabled:text-[#6F6F6F]",
    // loading (keep green, no hover change while loading)
    "data-[loading=true]:hover:bg-[#00A750]",
  ),
  secondary: cn(
    // default
    "bg-[#E4E5E0] text-[#00A750]",
    // hover
    "hover:bg-[#006430] hover:text-white",
    // pressed/active
    "active:bg-[#EFEFEC] active:text-[#00A750]",
    // focus
    "focus-visible:ring-2 focus-visible:ring-[#006430] focus-visible:ring-offset-2",
    // disabled
    "disabled:bg-[#E4E5E0] disabled:text-[#6F6F6F]",
    // loading (keep grey, no hover change while loading)
    "data-[loading=true]:hover:bg-[#E4E5E0] data-[loading=true]:hover:text-[#00A750]",
  ),
} as const;

const sizes = {
  sm: "px-[8px] py-[10px] text-sm leading-[1.2]",
  md: "px-[10px] py-3 text-[31px] leading-[38px]",
  lg: "px-[14px] py-[14px] text-[31px] leading-[38px]",
  xl: "px-[18px] py-[18px] text-[31px] leading-[38px]",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  disabled?: boolean;
  isLoading?: boolean;
  /** Secondary only: adds a green border on top of the grey background */
  withStroke?: boolean;
}

interface ButtonAsButton extends BaseButtonProps {
  as?: "button";
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: never;
  target?: never;
  rel?: never;
}

interface ButtonAsLink extends BaseButtonProps {
  as: "link";
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

// ─── Component ────────────────────────────────────────────────────────────────

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      disabled = false,
      isLoading = false,
      withStroke = false,
      as = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    const combinedClasses = cn(
      base,
      variants[variant],
      sizes[size],
      withStroke &&
        variant === "secondary" &&
        "ring-1 ring-[#00A750] ring-inset",
      className,
    );

    const content = (
      <>
        {isLoading && (
          <Spinner
            className={variant === "primary" ? "text-white" : "text-[#00A750]"}
          />
        )}
        {children}
      </>
    );

    if (as === "link") {
      const { href, target, rel, onClick } = props as ButtonAsLink;
      const linkRel =
        target === "_blank" ? (rel ?? "noopener noreferrer") : rel;

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={isDisabled ? undefined : href}
          target={isDisabled ? undefined : target}
          rel={linkRel}
          onClick={isDisabled ? (e) => e.preventDefault() : onClick}
          className={combinedClasses}
          aria-disabled={isDisabled}
          data-loading={isLoading || undefined}
          tabIndex={isDisabled ? -1 : undefined}
        >
          {content}
        </a>
      );
    }

    const { type = "button", onClick } = props as ButtonAsButton;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        data-loading={isLoading || undefined}
        className={combinedClasses}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
