import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * The hero backdrop: flat navy, a blueprint grid, and two clusters of
 * wireframe towers framing the headline.
 *
 * Minimal on purpose. The ground is the navy of the BIMAC mark — the same as
 * Custom Automation and the footer — and everything drawn on it is a single
 * hairline weight in a pale azure, held low enough that the headline stays the
 * brightest thing on the screen. The towers stand only at the outer edges, so
 * the centre, where the copy sits, is open ground.
 *
 * The towers are isometric prisms with their floor plates and bays drawn as
 * edges: the linework is what makes them read as a building model rather than
 * as boxes. Each draws itself in once on load, far ones first, and a few
 * corners carry an orange node — the one warm note, and the only thing that
 * keeps moving.
 */

/* ------------------------------------------------------------------ */
/* Isometric wireframe                                                  */
/* ------------------------------------------------------------------ */

const COS = 0.866;
const SIN = 0.5;

type Tower = {
  /** Screen position of the tower's back ground corner. */
  ox: number;
  oy: number;
  w: number;
  d: number;
  h: number;
  floors: number;
  bays: number;
  /** When it starts drawing, in ms. */
  delay: number;
};

function iso(t: Tower, x: number, y: number, z: number): string {
  const sx = t.ox + (x - y) * COS;
  const sy = t.oy + (x + y) * SIN - z;
  return `${sx.toFixed(1)} ${sy.toFixed(1)}`;
}

/** The outline: the top, the three visible verticals and the ground line. */
function frame(t: Tower): string {
  const { w, d, h } = t;
  return [
    `M${iso(t, 0, 0, h)}L${iso(t, w, 0, h)}L${iso(t, w, d, h)}L${iso(t, 0, d, h)}Z`,
    `M${iso(t, 0, d, 0)}L${iso(t, 0, d, h)}`,
    `M${iso(t, w, d, 0)}L${iso(t, w, d, h)}`,
    `M${iso(t, w, 0, 0)}L${iso(t, w, 0, h)}`,
    `M${iso(t, 0, d, 0)}L${iso(t, w, d, 0)}L${iso(t, w, 0, 0)}`,
  ].join("");
}

/** Floor plates round the two front faces, and the bays up them. */
function detail(t: Tower): string {
  const { w, d, h, floors, bays } = t;
  let out = "";
  for (let i = 1; i < floors; i++) {
    const z = (h * i) / floors;
    out += `M${iso(t, 0, d, z)}L${iso(t, w, d, z)}L${iso(t, w, 0, z)}`;
  }
  for (let i = 1; i < bays; i++) {
    const x = (w * i) / bays;
    const y = (d * i) / bays;
    out += `M${iso(t, x, d, 0)}L${iso(t, x, d, h)}`;
    out += `M${iso(t, w, y, 0)}L${iso(t, w, y, h)}`;
  }
  return out;
}

/** Left and right of the headline, stepping down toward the centre. */
const TOWERS: Tower[] = [
  // Left
  { ox: 150, oy: 470, w: 90, d: 90, h: 330, floors: 14, bays: 4, delay: 0 },
  { ox: 40, oy: 560, w: 80, d: 80, h: 190, floors: 8, bays: 3, delay: 150 },
  { ox: 300, oy: 560, w: 100, d: 80, h: 170, floors: 7, bays: 4, delay: 300 },
  { ox: 180, oy: 660, w: 70, d: 70, h: 90, floors: 4, bays: 3, delay: 450 },
  // Right
  { ox: 1370, oy: 450, w: 96, d: 96, h: 370, floors: 16, bays: 4, delay: 80 },
  { ox: 1490, oy: 560, w: 84, d: 84, h: 210, floors: 9, bays: 3, delay: 230 },
  { ox: 1230, oy: 560, w: 100, d: 90, h: 180, floors: 8, bays: 4, delay: 380 },
  { ox: 1360, oy: 670, w: 70, d: 70, h: 100, floors: 4, bays: 3, delay: 520 },
];

/** Corners that carry an orange node: [tower, x, y, z as a share of each]. */
const NODES: [number, number, number, number][] = [
  [0, 1, 1, 1],
  [4, 1, 1, 1],
  [2, 1, 0, 1],
  [6, 0, 1, 1],
];

function draw(delay: number, length = 1): CSSProperties {
  return { "--draw-length": length, animationDelay: `${delay}ms` } as CSSProperties;
}

/** One side's towers, drawn in their own box and pinned to the bottom edge. */
function Cluster({
  towers,
  indexOffset,
  viewBox,
  className,
}: {
  towers: Tower[];
  indexOffset: number;
  viewBox: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMax meet"
      className={cn(
        "absolute bottom-0 h-[82%] w-auto max-w-[34%] motion-reduce:[&_*]:!animate-none",
        className,
      )}
    >
      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
        {towers.map((tower) => (
          <g key={`${tower.ox}-${tower.oy}`}>
            <path
              d={detail(tower)}
              stroke="rgba(147,205,253,0.11)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray="1"
              className="animate-draw [animation-duration:2.4s]"
              style={draw(tower.delay + 500)}
            />
            <path
              d={frame(tower)}
              stroke="rgba(147,205,253,0.3)"
              strokeWidth="1.1"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray="1"
              className="animate-draw [animation-duration:2s]"
              style={draw(tower.delay)}
            />
          </g>
        ))}
      </g>

      {/* The one warm note. */}
      {NODES.filter(([index]) => index >= indexOffset && index < indexOffset + towers.length).map(
        ([index, fx, fy, fz]) => {
          const t = TOWERS[index];
          const [x, y] = iso(t, t.w * fx, t.d * fy, t.h * fz).split(" ").map(Number);
          return (
            <g key={index} transform={`translate(${x} ${y})`}>
              <circle
                r="3"
                fill="#F55F16"
                className="animate-pulse-node origin-center [transform-box:fill-box]"
                style={{ animationDelay: `${1800 + index * 400}ms` }}
              />
              <circle r="2.6" fill="#FB7C3C" />
            </g>
          );
        },
      )}
    </svg>
  );
}

export function HeroBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        // The navy of the BIMAC mark — the same ground as Custom Automation and the footer.
        "bg-navy",
        className,
      )}
    >
      {/* 1. The grid, strongest at the edges and gone behind the headline. */}
      <div
        className="absolute inset-0 bg-grid-dark bg-grid opacity-70"
        style={{
          maskImage: "radial-gradient(ellipse 70% 65% at 50% 45%, transparent 25%, #000 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 45%, transparent 25%, #000 85%)",
        }}
      />

      {/* 2. The towers — one cluster pinned to each edge, sized off the
          hero's height, so they frame the headline at any width and never
          walk in toward it on a wide screen. */}
      <Cluster
        towers={TOWERS.slice(0, 4)}
        indexOffset={0}
        viewBox="0 120 480 620"
        className="left-0 origin-bottom-left"
      />
      <Cluster
        towers={TOWERS.slice(4)}
        indexOffset={4}
        viewBox="1150 60 450 690"
        className="right-0 origin-bottom-right"
      />

      {/* 3. A soft light behind the headline, so the copy always reads on open
          ground, and a faint warmth low in the frame. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(40% 45% at 50% 42%, rgba(46,146,240,0.16), transparent 70%), radial-gradient(50% 40% at 50% 110%, rgba(245,95,22,0.12), transparent 70%)",
        }}
      />
    </div>
  );
}

export default HeroBackdrop;
