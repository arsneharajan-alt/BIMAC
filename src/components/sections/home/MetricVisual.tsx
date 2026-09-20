/**
 * The ghost behind each metric.
 *
 * One translucent object per card, sitting on the right where the copy runs
 * out. They are deliberately almost invisible — the number is the thing being
 * read, and anything here with real contrast competes with it. Same isometric
 * projection as the discipline solids, so the page has one geometry.
 */

/** Isometric projection, z up. +x goes right-and-down, +y left-and-down. */
function iso(x: number, y: number, z: number): [number, number] {
  return [(x - y) * 0.866, (x + y) * 0.5 - z];
}

const pts = (points: [number, number, number][]) =>
  points.map(([x, y, z]) => iso(x, y, z).join(",")).join(" ");

const TOP = "#F2F7FB";
const LEFT = "#DFE8F1";
const RIGHT = "#CBD9E6";
const EDGE = "rgba(99,120,141,0.22)";

/** One extruded plate, three visible faces. */
function Slab({
  x,
  y,
  z,
  w,
  d,
  h,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
}) {
  return (
    <g stroke={EDGE} strokeWidth="0.8" strokeLinejoin="round">
      <polygon
        points={pts([
          [x, y, z + h],
          [x + w, y, z + h],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ])}
        fill={TOP}
      />
      <polygon
        points={pts([
          [x, y + d, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ])}
        fill={LEFT}
      />
      <polygon
        points={pts([
          [x + w, y, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x + w, y, z + h],
        ])}
        fill={RIGHT}
      />
    </g>
  );
}

function Frame({ box, children }: { box: string; children: React.ReactNode }) {
  return (
    <svg viewBox={box} role="presentation" className="h-full w-full">
      {children}
    </svg>
  );
}

/** Projects — a drawing set, three sheets stepped off each other. */
function Sheets() {
  return (
    <Frame box="-66 -32 122 93">
      <Slab x={-8} y={-8} z={0} w={46} d={58} h={5} />
      <Slab x={-2} y={-2} z={7} w={46} d={58} h={5} />
      <Slab x={4} y={4} z={14} w={46} d={58} h={5} />
    </Frame>
  );
}

/** Time saved — a dial with most of its sweep filled. */
function Dial() {
  return (
    <svg viewBox="0 0 120 120" role="presentation" className="h-full w-full">
      <circle cx="60" cy="60" r="46" fill="#F7FAFC" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="#EEF3F8" strokeWidth="9" />
      {/* 80% of the way round, which is what the number says. */}
      <circle
        cx="60"
        cy="60"
        r="46"
        fill="none"
        stroke="#B4C8DB"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${0.8 * 2 * Math.PI * 46} ${2 * Math.PI * 46}`}
        transform="rotate(-90 60 60)"
      />
      <circle cx="60" cy="60" r="33" fill="#FFFFFF" />
      <line x1="60" y1="60" x2="60" y2="34" stroke="#BCCBDA" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="60" r="4" fill="#AFC0D1" />
    </svg>
  );
}

/** Turnaround — a rising run of bars with an arrow over them. */
function Rising() {
  return (
    <svg viewBox="0 0 130 120" role="presentation" className="h-full w-full">
      <g fill="#E8EEF4">
        <rect x="8" y="76" width="18" height="36" rx="3" />
        <rect x="34" y="60" width="18" height="52" rx="3" />
        <rect x="60" y="42" width="18" height="70" rx="3" />
      </g>
      {/* The arrow, thicker than the bars so it leads. */}
      <path
        d="M92 112 L92 36 L78 36 L103 6 L128 36 L114 36 L114 112 Z"
        fill="#DFE8F0"
      />
    </svg>
  );
}

/** Software — a stack of plates, one per application. */
function Layers() {
  return (
    <Frame box="-50 -59 100 98">
      <Slab x={-18} y={-18} z={0} w={52} d={52} h={6} />
      <Slab x={-18} y={-18} z={15} w={52} d={52} h={6} />
      <Slab x={-18} y={-18} z={30} w={52} d={52} h={6} />
    </Frame>
  );
}

const VISUALS = {
  sheets: Sheets,
  dial: Dial,
  rising: Rising,
  layers: Layers,
} as const;

export type MetricVisualId = keyof typeof VISUALS;

export function MetricVisual({ id }: { id: MetricVisualId }) {
  const Visual = VISUALS[id];
  return <Visual />;
}

export default MetricVisual;
