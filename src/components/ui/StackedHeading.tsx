import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The home page's section heading.
 *
 * Centred, in four beats: a tracked eyebrow, a short solid bar under it, a
 * title in two lines — the first in ink, the second in the accent — and one
 * quiet line of support. Every section of the home story opens the same way,
 * so the page reads as one sequence rather than a stack of unrelated bands.
 *
 * The bar is the only rule. The eyebrow no longer carries a hairline beside it,
 * which is the older left-aligned `SectionHeading` the inner pages still use.
 */
export function StackedHeading({
  eyebrow,
  title,
  accent,
  lede,
  onDark = false,
  size = "lg",
  className,
}: {
  eyebrow: string;
  /** The first line, in ink. */
  title?: ReactNode;
  /** The second line, in orange. */
  accent?: ReactNode;
  lede?: ReactNode;
  onDark?: boolean;
  /** `sm` for a band that has to share the first screen with the hero. */
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <div data-reveal="" className={cn("mx-auto flex max-w-3xl flex-col items-center text-center", className)}>
      <p
        className={cn(
          "text-[0.8125rem] font-bold uppercase tracking-[0.2em] sm:text-sm",
          onDark ? "text-brand-400" : "text-[#073157]",
        )}
      >
        {eyebrow}
      </p>
      <span aria-hidden="true" className="mt-3 h-[3px] w-8 rounded-full bg-brand-500" />

      {title || accent ? (
        <h2
          className={cn(
            "text-balance font-display font-bold leading-[1.08] tracking-tightest",
            size === "sm"
              ? "mt-4 text-[1.75rem] sm:text-[2.125rem]"
              : "mt-6 text-[2.125rem] sm:text-[2.75rem] lg:text-[3.25rem]",
            onDark ? "text-white" : "text-ink-950",
          )}
        >
          {title ? <span className="block">{title}</span> : null}
          {accent ? <span className="block text-brand-500">{accent}</span> : null}
        </h2>
      ) : null}

      {lede ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-pretty text-[1.0625rem] leading-relaxed sm:text-lg",
            onDark ? "text-ink-300" : "text-ink-500",
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/** The short bar under a card title — the section heading's rule, at card size. */
export function TitleBar({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("mt-3 block h-[3px] w-7 rounded-full bg-brand-500", className)} />;
}

export default StackedHeading;
