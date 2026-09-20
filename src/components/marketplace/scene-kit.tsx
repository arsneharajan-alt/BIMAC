import type { CSSProperties, ReactNode } from "react";

/**
 * The shared kit every tool scene is drawn with.
 *
 * One canvas, one palette, one clock. Scenes live in two files — the six
 * featured tools have bespoke ones in `ToolScene`, and every other tool gets
 * its discipline's scene from `DisciplineScene` — and both draw with this.
 *
 * Everything sits between y=18 and y=132 of the 320×200 canvas; below that is
 * where the card title sits, so anything drawn there would never be seen.
 *
 * All SVG and CSS on one shared 9s clock, so a grid of cards stays in step.
 * SMIL only where something travels a path or the view itself moves. No
 * JavaScript, no video, nothing to download.
 */

export const INK = "#061422";
export const LINE = "rgba(147,205,253,0.55)";
export const FAINT = "rgba(147,205,253,0.22)";
export const BRAND = "#FB7C3C";
export const BRAND_DEEP = "#F55F16";
export const STEEL = "rgba(94,211,190,0.85)";

/** Delay helper — every scene staggers its parts on the same 9s clock. */
export function d(ms: number): CSSProperties {
  return { animationDelay: `${ms}ms` };
}

export function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMin meet"
      role="img"
      aria-label={label}
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="scene-ground" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#0C2338" />
          <stop offset="100%" stopColor={INK} />
        </linearGradient>
        <pattern id="scene-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" stroke="rgba(147,205,253,0.08)" strokeWidth="1" />
        </pattern>
        {/* The ceiling grid every services drawing is set out against. */}
        <pattern id="ceiling-grid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M8 0H0V8" fill="none" stroke="rgba(147,205,253,0.13)" strokeWidth="0.6" />
        </pattern>
        <pattern id="cad-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(147,205,253,0.3)" strokeWidth="0.7" />
        </pattern>
      </defs>
      <rect width="320" height="200" fill="url(#scene-ground)" />
      <rect width="320" height="200" fill="url(#scene-grid)" />
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Axonometric plan space                                              */
/*                                                                     */
/* Scenes are drawn in plan and lifted, rather than drawn in screen     */
/* coordinates, so a duct that runs "east" in one scene runs east in    */
/* all of them and every scene shares one horizon.                      */
/* ------------------------------------------------------------------ */

/**
 * Plan point (x, y) at height z → screen. Keep |x|,|y| ≤ 30 and z ≤ 26.
 *
 * The scale is set so a 60 × 60 plan fills the card nearly edge to edge: a
 * drawing that sits in the middle third of the frame reads as a diagram, and
 * these have to read as a building.
 */
export function iso(x: number, y: number, z = 0): [number, number] {
  return [160 + (x - y) * 1.9, 80 + (x + y) * 0.78 - z];
}

export const xy = ([x, y]: [number, number]) => `${x.toFixed(1)} ${y.toFixed(1)}`;

/** A closed figure through plan points, each `[x, y, z?]`. */
export function shape(...points: Array<[number, number, number?]>): string {
  return `M${points.map(([x, y, z]) => xy(iso(x, y, z ?? 0))).join("L")}Z`;
}

/** An open run through plan points. */
export function run(...points: Array<[number, number, number?]>): string {
  return `M${points.map(([x, y, z]) => xy(iso(x, y, z ?? 0))).join("L")}`;
}

/**
 * A box standing on the plan: its top and two visible sides.
 *
 * Returned as three paths rather than one so each face can take its own fill —
 * which is the whole reason a box reads as solid rather than as a wireframe.
 */
export function box(
  x: number,
  y: number,
  w: number,
  dp: number,
  h: number,
): { top: string; left: string; right: string } {
  return {
    top: shape([x, y, h], [x + w, y, h], [x + w, y + dp, h], [x, y + dp, h]),
    left: shape([x, y + dp, 0], [x + w, y + dp, 0], [x + w, y + dp, h], [x, y + dp, h]),
    right: shape([x + w, y, 0], [x + w, y + dp, 0], [x + w, y + dp, h], [x + w, y, h]),
  };
}

/**
 * A number between 0 and 1 from a tool's id.
 *
 * Cards sit in grids of twenty and more, so a discipline's scene varies itself
 * per tool — a branch more, a run longer, a beat later. The hash is plain and
 * stable: the same tool draws the same scene on the server and in the browser,
 * which `Math.random()` could never promise.
 */
export function seedFrom(id: string): number {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) % 100003;
  }
  return hash / 100003;
}
