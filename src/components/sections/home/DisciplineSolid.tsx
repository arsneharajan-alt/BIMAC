import type { ReactNode } from "react";

/**
 * The three disciplines, built rather than drawn.
 *
 * Each is a small isometric model standing on a plinth: a house, a frame, a
 * plant room. Everything projects through `iso` below, so one light falls
 * across all three and they read as objects photographed together rather than
 * three pictures that happen to share a page.
 *
 * Faces are graded, not flat — a lit top, a mid left, a dark right, each with
 * a gradient down it. That grade is what separates a model from a diagram at
 * this size. Orange is structure and services; everything else is the white
 * and cool grey of a study model.
 */

/** Isometric projection, z up. +x goes right-and-down, +y left-and-down. */
function iso(x: number, y: number, z: number): [number, number] {
  return [(x - y) * 0.866, (x + y) * 0.5 - z];
}

const pts = (points: [number, number, number][]) =>
  points.map(([x, y, z]) => iso(x, y, z).join(",")).join(" ");

/* ------------------------------------------------------------------ */
/* Materials                                                           */
/* ------------------------------------------------------------------ */

type Tone = "white" | "plinth" | "orange" | "steel" | "glass" | "foliage" | "dark";

/** Top, left and right face, each as a pair of gradient stops. */
const TONES: Record<Tone, { top: [string, string]; left: [string, string]; right: [string, string] }> = {
  white: { top: ["#FFFFFF", "#F0F4F8"], left: ["#DEE6EE", "#C9D5E0"], right: ["#C6D2DE", "#AEBDCC"] },
  plinth: { top: ["#F4F7FA", "#E6ECF2"], left: ["#D6DFE8", "#C3CFDA"], right: ["#BFCBD8", "#A9B8C8"] },
  orange: { top: ["#FDB07A", "#F9884A"], left: ["#F26C22", "#DC5711"], right: ["#CE4F0D", "#B03F08"] },
  steel: { top: ["#EDF2F7", "#DCE4EC"], left: ["#C2CDD9", "#AAB8C7"], right: ["#A6B4C3", "#8E9FB1"] },
  glass: { top: ["#FFD9B5", "#FCBC8A"], left: ["#F9A867", "#EE8B3E"], right: ["#E07C2E", "#C4641C"] },
  foliage: { top: ["#CFDCD2", "#B7C9BD"], left: ["#A8BDAF", "#93AC9C"], right: ["#93AC9C", "#7E9A88"] },
  dark: { top: ["#9FAEBD", "#8496A8"], left: ["#8496A8", "#6E8294"], right: ["#6E8294", "#5B7084"] },
};

const FACES = ["top", "left", "right"] as const;

/** Every gradient the three models can use, emitted once per svg. */
function Materials({ ns }: { ns: string }) {
  return (
    <defs>
      {(Object.keys(TONES) as Tone[]).flatMap((tone) =>
        FACES.map((face) => {
          const [from, to] = TONES[tone][face];
          return (
            <linearGradient
              key={`${tone}-${face}`}
              id={`${ns}-${tone}-${face}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
          );
        }),
      )}
      <filter id={`${ns}-soft`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
    </defs>
  );
}

/* ------------------------------------------------------------------ */
/* Solids                                                              */
/* ------------------------------------------------------------------ */

interface BoxProps {
  ns: string;
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  tone?: Tone;
  opacity?: number;
}

/** One extruded box, three visible faces. */
function Box({ ns, x, y, z, w, d, h, tone = "white", opacity = 1 }: BoxProps) {
  return (
    <g opacity={opacity}>
      <polygon
        points={pts([
          [x, y, z + h],
          [x + w, y, z + h],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ])}
        fill={`url(#${ns}-${tone}-top)`}
      />
      <polygon
        points={pts([
          [x, y + d, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ])}
        fill={`url(#${ns}-${tone}-left)`}
      />
      <polygon
        points={pts([
          [x + w, y, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x + w, y, z + h],
        ])}
        fill={`url(#${ns}-${tone}-right)`}
      />
    </g>
  );
}

/** A patch laid flat on top of something — an opening, a lawn, a shadow. */
function Patch({
  ns,
  x,
  y,
  z,
  w,
  d,
  tone = "dark",
  opacity = 1,
}: Omit<BoxProps, "h"> & { tone?: Tone }) {
  return (
    <polygon
      points={pts([
        [x, y, z],
        [x + w, y, z],
        [x + w, y + d, z],
        [x, y + d, z],
      ])}
      fill={`url(#${ns}-${tone}-top)`}
      opacity={opacity}
    />
  );
}

/** The plinth every model stands on, plus the shadow it casts. */
function Plinth({ ns, size = 100, h = 5 }: { ns: string; size?: number; h?: number }) {
  const [, bottom] = iso(size, size, 0);
  return (
    <>
      <ellipse
        cx="0"
        cy={bottom + 6}
        rx={size * 0.78}
        ry={size * 0.18}
        fill="#0F2131"
        opacity="0.10"
        filter={`url(#${ns}-soft)`}
      />
      <Box ns={ns} x={0} y={0} z={-h} w={size} d={size} h={h} tone="plinth" />
    </>
  );
}

/** The warm bounce the reference has coming off the plinth behind the model. */
function Glow({ ns }: { ns: string }) {
  return (
    <ellipse
      cx="0"
      cy="38"
      rx="52"
      ry="16"
      fill="#F55F16"
      opacity="0.13"
      filter={`url(#${ns}-soft)`}
    />
  );
}

function Frame({ ns, children }: { ns: string; children: ReactNode }) {
  return (
    // The box is the projection's own extent: x' runs to +/-87 across a
    // 100-square plinth, and y' from about -56 at the top of the tallest
    // model to 105 at the plinth's near corner, plus room for its shadow.
    <svg viewBox="-92 -62 184 180" role="presentation" className="h-full w-full">
      <Materials ns={ns} />
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Architecture — a house on its plot                                  */
/* ------------------------------------------------------------------ */

function Architecture() {
  const ns = "arch";
  return (
    <Frame ns={ns}>
      <Glow ns={ns} />
      <Plinth ns={ns} />

      {/* The garden, so the plinth reads as ground rather than a table. */}
      <Patch ns={ns} x={6} y={58} z={0.2} w={34} d={34} tone="foliage" opacity={0.5} />

      {/* Far wing first — near things are larger x + y and overlap it. */}
      <Box ns={ns} x={14} y={10} z={0} w={34} d={40} h={26} />
      <Box ns={ns} x={12} y={8} z={26} w={38} d={44} h={2.5} tone="steel" />

      {/* The tall block, set back and to the right. */}
      <Box ns={ns} x={52} y={12} z={0} w={32} d={34} h={44} />
      <Box ns={ns} x={50} y={10} z={44} w={36} d={38} h={2.5} tone="steel" />

      {/* Its glazed face, lit from inside — the one warm thing on the model. */}
      <Box ns={ns} x={83.5} y={17} z={6} w={1.5} d={24} h={30} tone="glass" />
      <g opacity="0.5">
        {[21, 27, 33, 39].map((y) => (
          <Box key={y} ns={ns} x={84.6} y={y} z={6} w={0.8} d={1} h={30} tone="steel" />
        ))}
      </g>

      {/* The low wing coming forward, with its terrace. */}
      <Box ns={ns} x={20} y={56} z={0} w={30} d={28} h={15} />
      <Box ns={ns} x={18} y={54} z={15} w={34} d={32} h={2.5} tone="steel" />
      <Box ns={ns} x={54} y={58} z={0} w={22} d={24} h={3} tone="steel" />

      {/* Glazing to the low wing, facing the viewer. */}
      <Box ns={ns} x={24} y={83} z={2} w={22} d={1.5} h={10} tone="glass" />

      {/* Two trees, for scale. */}
      {[
        [8, 46],
        [88, 74],
      ].map(([tx, ty]) => (
        <g key={`${tx}-${ty}`}>
          <Box ns={ns} x={tx} y={ty} z={0} w={2} d={2} h={9} tone="foliage" />
          <Box ns={ns} x={tx - 3.5} y={ty - 3.5} z={9} w={9} d={9} h={9} tone="foliage" />
        </g>
      ))}
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Structures — four floors of frame                                   */
/* ------------------------------------------------------------------ */

function Structure() {
  const ns = "str";
  const grid = [16, 44, 72];
  const levels = [0, 17, 34, 51];
  const slab = 4;
  const col = 5;

  return (
    <Frame ns={ns}>
      <Glow ns={ns} />
      <Plinth ns={ns} />

      {levels.map((z, level) => (
        <g key={z}>
          {/* Columns up to this level, back row first. */}
          {grid.flatMap((gy) =>
            grid.map((gx) => (
              <Box
                key={`${gx}-${gy}`}
                ns={ns}
                x={gx}
                y={gy}
                z={z}
                w={col}
                d={col}
                h={17 - slab}
                tone="orange"
              />
            )),
          )}
          {/* The slab they carry. */}
          <Box ns={ns} x={12} y={12} z={z + 17 - slab} w={70} d={70} h={slab} />
          {/* A void through it, so it reads as a floor plate and not a lid. */}
          <Patch ns={ns} x={30} y={30} z={z + 17} w={22} d={22} opacity={0.35} />
          {level === levels.length - 1 ? (
            <Patch ns={ns} x={30} y={30} z={z + 17} w={22} d={22} opacity={0.45} />
          ) : null}
        </g>
      ))}

    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* MEP — a plant skid and the services off it                          */
/* ------------------------------------------------------------------ */

function Mep() {
  const ns = "mep";
  return (
    <Frame ns={ns}>
      <Glow ns={ns} />
      <Plinth ns={ns} />

      {/* The skid the unit sits on. */}
      <Box ns={ns} x={6} y={16} z={0} w={34} d={44} h={3} tone="steel" />

      {/* The air handling unit, panelled. */}
      <Box ns={ns} x={8} y={18} z={3} w={30} d={40} h={30} />
      <g opacity="0.65">
        {[22, 28, 34, 40, 46, 52].map((y) => (
          <Box key={y} ns={ns} x={38.2} y={y} z={8} w={0.6} d={3} h={20} tone="steel" />
        ))}
      </g>
      {/* Its access panel, in the house colour. */}
      <Box ns={ns} x={8} y={57.6} z={9} w={12} d={0.8} h={16} tone="orange" />

      {/* The supply duct off the top, running away to the right. */}
      <Box ns={ns} x={38} y={24} z={20} w={34} d={18} h={16} />
      <g opacity="0.55">
        {[46, 56, 66].map((x) => (
          <Box key={x} ns={ns} x={x} y={23.4} z={19.4} w={2.5} d={19} h={17} tone="steel" />
        ))}
      </g>
      {/* The riser it turns up into. */}
      <Box ns={ns} x={72} y={24} z={20} w={18} d={18} h={34} />
      <Box ns={ns} x={70.5} y={22.5} z={54} w={21} d={21} h={3} tone="steel" />

      {/* Pipework along the front of the skid: two hot, one chilled. */}
      <Box ns={ns} x={40} y={62} z={10} w={50} d={5} h={5} tone="orange" />
      <Box ns={ns} x={40} y={70} z={10} w={50} d={5} h={5} tone="orange" />
      <Box ns={ns} x={40} y={78} z={10} w={50} d={5} h={5} tone="dark" />

      {/* What holds them up. */}
      {[44, 66, 86].map((x) => (
        <g key={x}>
          <Box ns={ns} x={x} y={62} z={0} w={2} d={2} h={10} tone="steel" />
          <Box ns={ns} x={x} y={81} z={0} w={2} d={2} h={10} tone="steel" />
          <Box ns={ns} x={x} y={62} z={8} w={2} d={21} h={2} tone="steel" />
        </g>
      ))}
    </Frame>
  );
}

const SOLIDS = {
  architecture: Architecture,
  structure: Structure,
  mep: Mep,
} as const;

export type SolidId = keyof typeof SOLIDS;

export function DisciplineSolid({ id }: { id: SolidId }) {
  const Solid = SOLIDS[id];
  return <Solid />;
}

export default DisciplineSolid;
