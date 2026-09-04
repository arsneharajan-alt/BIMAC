import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import Icon from "./Icon";
import type { GlyphId } from "@/types";

/** `azure` variants carry the software axis; orange stays the primary action. */
type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "azure"
  | "onDark"
  | "onDarkGhost"
  | "onDarkAzure";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white shadow-[0_1px_2px_rgba(12,16,21,0.10)] hover:bg-brand-600 active:bg-brand-700 focus-visible:ring-offset-white",
  secondary:
    "border border-ink-200 bg-white text-ink-900 hover:border-ink-300 hover:bg-ink-50 focus-visible:ring-offset-white",
  ghost: "text-ink-700 hover:bg-ink-100 hover:text-ink-900 focus-visible:ring-offset-white",
  azure:
    "border border-azure-200 bg-azure-50 text-azure-700 hover:border-azure-300 hover:bg-azure-100 focus-visible:ring-azure-500/60 focus-visible:ring-offset-white",
  onDark: "bg-white text-ink-950 hover:bg-ink-100 focus-visible:ring-offset-ink-950",
  onDarkGhost:
    "border border-white/20 text-white hover:border-white/40 hover:bg-white/5 focus-visible:ring-offset-ink-950",
  onDarkAzure:
    "border border-azure-400/45 bg-azure-500/10 text-azure-100 hover:border-azure-400/80 hover:bg-azure-500/20 hover:text-white focus-visible:ring-azure-400/60 focus-visible:ring-offset-ink-950",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-7 text-[0.9375rem]",
};

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Trailing icon; arrows nudge on hover. */
  icon?: GlyphId;
  leadingIcon?: GlyphId;
}

interface AsLink extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

interface AsButton extends BaseProps {
  href?: never;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  disabled?: boolean;
  "aria-label"?: string;
}

export type ButtonProps = AsLink | AsButton;

export function Button(props: ButtonProps) {
  const { children, variant = "primary", size = "md", className, icon, leadingIcon } = props;

  const classes = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {leadingIcon ? <Icon name={leadingIcon} className="text-[1.1em]" /> : null}
      <span>{children}</span>
      {icon ? (
        <Icon
          name={icon}
          className={cn(
            "text-[1.05em] transition-transform duration-200",
            icon === "arrow-right" && "group-hover/btn:translate-x-0.5",
            icon === "arrow-up-right" &&
              "group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5",
          )}
        />
      ) : null}
    </>
  );

  if (typeof props.href === "string") {
    const { href, target, rel, onClick } = props as AsLink;
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }

  const { type = "button", onClick, disabled } = props as AsButton;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={(props as AsButton)["aria-label"]}
      className={classes}
    >
      {content}
    </button>
  );
}

export default Button;
