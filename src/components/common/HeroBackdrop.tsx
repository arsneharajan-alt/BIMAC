import { cn } from "@/lib/utils";

/**
 * The hero backdrop: one flat blue, with the wireframe drawing over it.
 *
 * The blue is ink-950, the same ground the whole site's dark sections use, laid
 * on plain — no gradient, no scrims. It used to be a five-stop gradient opening
 * to a lighter azure with two dark washes over it to keep the copy readable,
 * which is a lot of machinery for a background that reads better flat.
 *
 * The artwork is the reference drawing exactly as supplied — not traced, not
 * redrawn. An earlier version vectorised it, and that is what broke the lines:
 * a tracer approximates, so every edge came back slightly wrong.
 *
 * The one piece of processing turns the drawing into a line layer: each pixel's
 * darkness becomes opacity and the paper falls away, leaving the strokes on
 * their own in the site's pale blue. The ramp is deliberately gentle. Pushing
 * the levels hard — which an earlier pass did — clips the anti-aliasing off
 * every edge and turns clean CAD lines into a speckled pencil sketch; a soft
 * ramp keeps them straight and smooth, and needs no blend mode to sit on blue.
 *
 * Over the top of it all sits the opening plane: white, full-bleed, shrinking
 * toward the middle and rounding into a circle as it goes. See `hero-plane` in
 * globals.css — it is also what stages the copy, since white type is invisible
 * against it and only the orange survives.
 *
 * It is held at its first frame — full-bleed white — until the black opening
 * panel has finished fading off it, so the panel fades black into white with no
 * seam and the plane takes over from exactly there.
 */

export function HeroBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        "bg-ink-950",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero/wireframe-lines.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />

      {/* The opening plane: white, then a circle, then gone. */}
      <div className="hero-plane hero-staged bg-white" />
    </div>
  );
}

export default HeroBackdrop;
