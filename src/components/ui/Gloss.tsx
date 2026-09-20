import { cn } from "@/lib/utils";

/**
 * The gloss, shared.
 *
 * Every card on the site is the same physical object: a slab with a lit top
 * edge, a face that falls off toward the bottom, and two shadows — a tight one
 * that sits it on the page and a wide soft one that lifts it off. Written once
 * here so the landing page and the catalogue cards cannot drift into being two
 * different materials.
 *
 * It is depth, not glass: no blur, no neon, no frosted panel over a gradient.
 */
export const GLOSS =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(6,20,34,0.05),0_14px_30px_-10px_rgba(6,20,34,0.18),0_34px_64px_-28px_rgba(6,20,34,0.28)]";

/** The same slab cut from the dark end of the ramp. */
export const GLOSS_DARK =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.30),0_18px_40px_-14px_rgba(0,0,0,0.55),0_40px_70px_-30px_rgba(0,0,0,0.6)]";

/** How a card moves under the pointer — a lift, slow out, nothing else. */
export const LIFT =
  "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5";

/**
 * A single diagonal highlight travelling across the face, as on glass.
 *
 * `rounded` has to match the card it sits in or the highlight squares off the
 * corners.
 */
export function Sheen({
  className,
  rounded = "rounded-2xl",
  onDark = false,
}: {
  className?: string;
  rounded?: string;
  onDark?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-10",
        rounded,
        onDark
          ? "bg-[linear-gradient(112deg,transparent_36%,rgba(255,255,255,0.10)_46%,rgba(255,255,255,0.03)_53%,transparent_63%)]"
          : "bg-[linear-gradient(112deg,transparent_34%,rgba(255,255,255,0.55)_45%,rgba(255,255,255,0.12)_52%,transparent_62%)]",
        "opacity-70 transition-opacity duration-500 group-hover:opacity-100",
        className,
      )}
    />
  );
}

export default Sheen;
