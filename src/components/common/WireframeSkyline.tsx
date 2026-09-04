import { cn } from "@/lib/utils";

/**
 * A receding row of wireframe towers, for the empty right of the hero.
 *
 * Pure backdrop: `aria-hidden`, `pointer-events-none`, and held at low opacity
 * so it never competes with the copy on the left.
 *
 * One-point perspective with the vanishing point off to the left, so the row
 * grows from a low block at the far end to a tower at the near edge and the
 * street line runs back toward the horizon. Each mass is a box with floor
 * plates and mullions drawn as edges — the linework is what makes it read as
 * architecture rather than stacked rectangles.
 */

const VIEW_W = 440;
const VIEW_H = 640;

/** Vanishing point, off the left edge on the horizon. */
const VP_X = -110;
const VP_Y = 415;

function r(value: number): number {
  return Math.round(value * 10) / 10;
}

function px(x: number, k: number): number {
  return r(VP_X + (x - VP_X) * k);
}
function py(y: number, k: number): number {
  return r(VP_Y + (y - VP_Y) * k);
}

interface Mass {
  x0: number;
  x1: number;
  top: number;
  base: number;
  /** How far the rear face is pulled toward the vanishing point. */
  k: number;
  bays: number;
  floors: number;
  opacity: number;
}

/** Far to near, left to right — the row steps up as it approaches. */
const MASSES: Mass[] = [
  { x0: 20, x1: 78, top: 352, base: 436, k: 0.74, bays: 3, floors: 4, opacity: 0.45 },
  { x0: 72, x1: 158, top: 296, base: 452, k: 0.72, bays: 4, floors: 7, opacity: 0.6 },
  { x0: 150, x1: 248, top: 224, base: 470, k: 0.7, bays: 4, floors: 10, opacity: 0.75 },
  { x0: 236, x1: 330, top: 116, base: 492, k: 0.68, bays: 4, floors: 15, opacity: 0.9 },
  { x0: 312, x1: 424, top: 26, base: 524, k: 0.64, bays: 5, floors: 20, opacity: 1 },
];

interface Drawn {
  frame: string;
  detail: string;
  opacity: number;
}

function drawMass(mass: Mass): Drawn {
  const { x0, x1, top, base, k, bays, floors } = mass;

  const bx0 = px(x0, k);
  const bx1 = px(x1, k);
  const bTop = py(top, k);
  const bBase = py(base, k);

  const frame = [
    `M${x0} ${top}H${x1}V${base}H${x0}Z`,
    `M${bx0} ${bTop}H${bx1}V${bBase}H${bx0}Z`,
    `M${x0} ${top}L${bx0} ${bTop}`,
    `M${x1} ${top}L${bx1} ${bTop}`,
    `M${x0} ${base}L${bx0} ${bBase}`,
    `M${x1} ${base}L${bx1} ${bBase}`,
  ].join("");

  const segments: string[] = [];

  // Floor plates, drawn as full rings so the tower is see-through.
  for (let f = 1; f < floors; f += 1) {
    const y = r(top + ((base - top) * f) / floors);
    const by = py(y, k);
    segments.push(
      `M${x0} ${y}H${x1}M${x0} ${y}L${bx0} ${by}M${x1} ${y}L${bx1} ${by}M${bx0} ${by}H${bx1}`,
    );
  }

  // Mullions on the bay grid, front and back.
  for (let b = 1; b < bays; b += 1) {
    const x = r(x0 + ((x1 - x0) * b) / bays);
    segments.push(`M${x} ${top}V${base}`);
    segments.push(`M${px(x, k)} ${bTop}V${bBase}`);
  }

  return { frame, detail: segments.join(""), opacity: mass.opacity };
}

const DRAWN = MASSES.map(drawMass);

/** The street: kerb lines running back to the same vanishing point. */
const STREET = [
  `M${VIEW_W} ${VIEW_H}L${px(VIEW_W, 0.12)} ${py(VIEW_H, 0.12)}`,
  `M${VIEW_W - 120} ${VIEW_H}L${px(VIEW_W - 120, 0.16)} ${py(VIEW_H - 120, 0.16)}`,
  `M0 ${VP_Y}H${VIEW_W}`,
].join("");

export function WireframeSkyline({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none", className)}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMaxYMax meet"
        className="h-full w-full"
        focusable="false"
      >
        <defs>
          {/* Fades in from the roofline and out again at the street. */}
          <linearGradient id="skyline-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="14%" stopColor="#9A9A9A" />
            <stop offset="38%" stopColor="#FFFFFF" />
            <stop offset="82%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#2F2F2F" />
          </linearGradient>
          <mask id="skyline-mask">
            <rect width={VIEW_W} height={VIEW_H} fill="url(#skyline-fade)" />
          </mask>
        </defs>

        <g
          mask="url(#skyline-mask)"
          stroke="#FFFFFF"
          fill="none"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        >
          <path d={STREET} strokeWidth="0.6" opacity="0.28" />
          {DRAWN.map((mass, index) => (
            <g key={index} opacity={mass.opacity}>
              <path d={mass.detail} strokeWidth="0.55" opacity="0.55" />
              <path d={mass.frame} strokeWidth="0.9" opacity="0.85" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default WireframeSkyline;
