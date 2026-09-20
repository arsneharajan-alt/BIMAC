import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * BIMAC identity mark.
 *
 * An isometric stack of three plates — the model, the data, and the tooling
 * layered over it — with the top plate carrying the brand orange. Original to
 * BIMAC; drawn rather than sourced.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={cn("h-9 w-9 shrink-0", className)} aria-hidden="true">
      <rect width="36" height="36" rx="9" className="fill-ink-950" />
      <g strokeLinejoin="round" strokeLinecap="round">
        {/* lower plates — the model and its data */}
        <path
          d="M18 22.4 27.4 17.6 18 12.8 8.6 17.6z"
          className="fill-none stroke-white/30"
          strokeWidth="1.5"
        />
        <path
          d="M18 26.6 27.4 21.8 18 17 8.6 21.8z"
          className="fill-none stroke-white/55"
          strokeWidth="1.5"
        />
        {/* top plate — BIMAC tooling */}
        <path d="M18 17.6 27.4 12.8 18 8 8.6 12.8z" className="fill-brand-500" />
        <path
          d="M18 17.6 27.4 12.8 18 8 8.6 12.8z"
          className="fill-none stroke-brand-300/70"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

export function Wordmark({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-display text-[1.375rem] font-semibold leading-none tracking-[-0.03em]",
        onDark ? "text-white" : "text-ink-950",
        className,
      )}
    >
      BIMAC
      <span className="text-brand-500">.</span>
    </span>
  );
}

/**
 * The real lockup — mark and wordmark together, as drawn.
 *
 * Two files, not one recoloured by CSS: the navy artwork disappears on a dark
 * ground, so the dark version is a separate export with the navy turned white
 * and the orange kept. The strapline is cropped off both, because at header
 * height it is unreadable and only makes the lockup wider than it needs to be.
 * Generated from `public/images/hero/bimac-logo.jpeg` — see the note in
 * public/logos/README.md.
 */
export function Logo({
  className,
  onDark = false,
  href = "/",
}: {
  className?: string;
  onDark?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="BIMAC — home"
      className={cn(
        "group inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2",
        onDark ? "focus-visible:ring-offset-ink-950" : "focus-visible:ring-offset-white",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={onDark ? "/logos/bimac-lockup-light.png" : "/logos/bimac-lockup.png"}
        alt="BIMAC — BIM Automation Consulting"
        className="h-9 w-auto transition-transform duration-300 group-hover:-translate-y-px sm:h-10"
      />
    </Link>
  );
}

export default Logo;
