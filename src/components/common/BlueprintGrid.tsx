import { cn } from "@/lib/utils";

/**
 * Subtle drafting-grid backdrop. Used behind dark sections and hero areas to
 * give surfaces a technical rather than decorative texture.
 */
export function BlueprintGrid({
  className,
  variant = "dark",
  fade = true,
}: {
  className?: string;
  variant?: "dark" | "light";
  fade?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0",
        variant === "dark" ? "bg-grid-dark" : "bg-grid-light",
        "bg-grid",
        fade &&
          "[mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)]",
        className,
      )}
    />
  );
}

/** Thin measured rule with end ticks — a drafting detail used as a divider. */
export function DimensionRule({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 8"
      preserveAspectRatio="none"
      className={cn("h-2 w-full", onDark ? "text-white/20" : "text-ink-300", className)}
    >
      <path
        d="M0 4h200M0.5 0.5v7M199.5 0.5v7"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default BlueprintGrid;
