import { cn } from "@/lib/utils";

/**
 * The hero backdrop: the BIM render, held well back.
 *
 * The section has no background of its own any more — no gradient, no drawing,
 * no scrim stack. It is the site's flat ink-950, the same ink every dark band
 * below it uses, with one picture laid on at low opacity. The headline is the
 * hero; this is the room it stands in.
 *
 * Opacity is the whole technique, and it is doing more than dimming. The
 * supplied render is bright, saturated and busy — a lit building, a wireframe
 * overlay, floating panels, a Revit mark. At full strength every one of those
 * competes with the copy, and the orange in the headline has nothing left to
 * win against. Dropped to a third and sat on navy, the same picture stops
 * being a subject and becomes what it is good at: texture that says BIM
 * without asking to be read.
 *
 * Three layers, bottom to top:
 *
 *   1. the render, full bleed and faint, anchored right. The building sits
 *      centre-left in the source frame, so anchoring right walks it out from
 *      behind the centred column and lets the floating panels carry the right
 *      of the section;
 *   2. the reading ground — a soft ellipse of ink under the copy. The render
 *      is brightest through its middle, which is exactly where the headline
 *      is, so this is darkened specifically rather than everywhere;
 *   3. the frame — top and bottom gradients seating the header and the button
 *      against the picture, and a brand glow low and warm, the one warm note
 *      against all that blue.
 */

export function HeroBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        // The ground. Everything above it is laid on this, not on a gradient.
        "bg-ink-950",
        className,
      )}
    >
      {/* 1. The render. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero/bim-overlay.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover object-right opacity-[0.34]"
      />

      {/* 2. The reading ground. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(76% 66% at 42% 50%, rgba(6,20,34,0.88) 0%, rgba(6,20,34,0.6) 48%, transparent 80%)",
        }}
      />

      {/* 3. The frame. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-transparent to-ink-950/88" />
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(52rem 32rem at 46% 96%, rgba(245,95,22,0.55), transparent 72%)",
        }}
      />
    </div>
  );
}

export default HeroBackdrop;
