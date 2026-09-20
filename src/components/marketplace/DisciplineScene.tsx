import type { ReactNode } from "react";
import {
  BRAND,
  FAINT,
  Frame,
  LINE,
  box,
  d,
  iso,
  run,
  seedFrom,
  shape,
  xy,
} from "./scene-kit";
import type { DisciplineId } from "@/types";

/**
 * A scene for every tool in the catalogue.
 *
 * The six featured tools have their own drawings; the other two hundred cannot,
 * so each discipline has one scene that says what that discipline builds — a
 * frame going up for structure, a duct run charging for HVAC, heads covering a
 * floor for fire fighting. Every card is then a drawing rather than an icon.
 *
 * Each scene reads a seed off the tool's id and shifts itself with it: a branch
 * more, a run longer, a beat later. Twenty cards in a grid are recognisably the
 * same discipline without being twenty copies of one picture.
 */

type SceneProps = { seed: number };

/** A pulse travelling a path — flow, current, water, signal. */
function Pulse({
  path,
  delay = 0,
  colour = "#fff",
  r = 2.4,
  dur = 3,
}: {
  path: string;
  delay?: number;
  colour?: string;
  r?: number;
  dur?: number;
}) {
  return (
    <circle r={r} fill={colour}>
      <animateMotion
        path={path}
        dur={`${dur}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        rotate="auto"
      />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.1;0.8;1"
        dur={`${dur}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  );
}

/** The floor plate nearly every scene stands on. */
function Plate({ size = 30, z = 0 }: { size?: number; z?: number }) {
  return (
    <path
      d={shape([-size, -size, z], [size, -size, z], [size, size, z], [-size, size, z])}
      fill="rgba(147,205,253,0.05)"
      stroke={FAINT}
      strokeWidth="0.8"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Architecture — the envelope goes up around a plan                    */
/* ------------------------------------------------------------------ */

function Architecture({ seed }: SceneProps) {
  const split = -6 + Math.round(seed * 12);
  const walls: Array<[number, number, number, number]> = [
    [-28, -22, 28, -22],
    [28, -22, 28, 20],
    [28, 20, -28, 20],
    [-28, 20, -28, -22],
    [split, -22, split, 20],
  ];

  return (
    <Frame label="A floor plan with its walls standing up into a model">
      <Plate size={30} />
      {walls.map(([x1, y1, x2, y2], index) => (
        <g key={`${x1}-${y1}-${x2}-${y2}`} className="animate-scene-in" style={d(index * 220)}>
          <path
            d={shape([x1, y1, 0], [x2, y2, 0], [x2, y2, 17], [x1, y1, 17])}
            fill="rgba(147,205,253,0.13)"
            stroke={LINE}
            strokeWidth="0.9"
          />
        </g>
      ))}

      {/* The opening, with its swing — the one thing that says architecture. */}
      <g className="animate-scene-in" style={d(1300)}>
        <path
          d={`M${xy(iso(split + 4, 20))}A14 7 0 0 1 ${xy(iso(split + 14, 20))}`}
          fill="none"
          stroke={BRAND}
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />
        <path d={run([split + 4, 20, 0], [split + 4, 20, 13])} stroke={BRAND} strokeWidth="1.6" />
      </g>

      {/* The roof settling on. */}
      <g className="animate-scene-in" style={d(1600)}>
        <path
          d={shape([-28, -22, 18], [28, -22, 18], [28, 20, 18], [-28, 20, 18])}
          fill="rgba(251,124,60,0.16)"
          stroke={BRAND}
          strokeWidth="1"
        />
      </g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Structure — the frame assembles, then takes its slab                 */
/* ------------------------------------------------------------------ */

function Structure({ seed }: SceneProps) {
  const bays = seed > 0.5 ? 3 : 2;
  const step = 52 / bays;
  const columns = Array.from({ length: bays + 1 }, (_, index) => -26 + index * step);

  return (
    <Frame label="A structural frame assembling: columns, beams, then the slab">
      <Plate size={30} />

      {columns.map((x, index) =>
        [-20, 18].map((y) => {
          const faces = box(x - 2.5, y - 2.5, 5, 5, 22);
          return (
            <g
              key={`${x}-${y}`}
              className="animate-scene-in"
              style={d(index * 160 + (y > 0 ? 80 : 0))}
              stroke={LINE}
              strokeWidth="0.8"
            >
              <path d={faces.left} fill="rgba(147,205,253,0.12)" />
              <path d={faces.right} fill="rgba(147,205,253,0.2)" />
              <path d={faces.top} fill="rgba(147,205,253,0.3)" />
            </g>
          );
        }),
      )}

      {/* Beams spanning between them, each arriving after its columns. */}
      {[-20, 18].map((y) => (
        <g key={y} className="animate-scene-in" style={d(900 + (y > 0 ? 160 : 0))}>
          <path
            d={shape([-26, y - 1.6, 22], [26, y - 1.6, 22], [26, y + 1.6, 22], [-26, y + 1.6, 22])}
            fill="rgba(251,124,60,0.28)"
            stroke={BRAND}
            strokeWidth="0.9"
          />
        </g>
      ))}

      {/* And the slab it all carries. */}
      <g className="animate-scene-in" style={d(1450)}>
        <path
          d={shape([-28, -22, 24], [28, -22, 24], [28, 20, 24], [-28, 20, 24])}
          fill="rgba(147,205,253,0.16)"
          stroke={LINE}
          strokeWidth="1"
        />
        <path
          d={run([-28, -22, 24], [28, -22, 24])}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.8"
          strokeDasharray="4 4"
        />
      </g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* HVAC — a duct run charging, branch by branch                         */
/* ------------------------------------------------------------------ */

function Hvac({ seed }: SceneProps) {
  const branches = seed > 0.45 ? [-14, 4, 20] : [-8, 14];
  const main = run([-28, -12, 16], [28, -12, 16]);

  return (
    <Frame label="A duct run with branches and diffusers, air moving through it">
      <Plate size={30} />

      {/* The ceiling the run sits under, kept quiet behind it. */}
      <path
        d={shape([-28, -26, 20], [28, -26, 20], [28, 22, 20], [-28, 22, 20])}
        fill="url(#ceiling-grid)"
        opacity="0.35"
      />

      {/* Main duct, as a box rather than a line — it is a duct, not a pipe. */}
      <g className="animate-scene-in" stroke={LINE} strokeWidth="0.9">
        <path
          d={shape([-28, -16, 16], [28, -16, 16], [28, -8, 16], [-28, -8, 16])}
          fill="rgba(147,205,253,0.38)"
        />
        <path
          d={shape([-28, -8, 16], [28, -8, 16], [28, -8, 10], [-28, -8, 10])}
          fill="rgba(147,205,253,0.2)"
        />
      </g>

      {branches.map((x, index) => (
        <g key={x} className="animate-scene-in" style={d(500 + index * 260)}>
          <path
            d={shape([x - 2.6, -8, 14], [x + 2.6, -8, 14], [x + 2.6, 18, 14], [x - 2.6, 18, 14])}
            fill="rgba(147,205,253,0.3)"
            stroke={LINE}
            strokeWidth="0.9"
          />
          {/* The diffuser at the end of it. */}
          <path
            d={shape([x - 5, 15, 13.4], [x + 5, 15, 13.4], [x + 5, 22, 13.4], [x - 5, 22, 13.4])}
            fill="rgba(251,124,60,0.45)"
            stroke={BRAND}
            strokeWidth="1"
          />
          <Pulse
            path={run([x, -8, 14], [x, 19, 14])}
            delay={1 + index * 0.6}
            colour="rgba(255,255,255,0.9)"
            r={1.8}
            dur={2.4}
          />
        </g>
      ))}

      <Pulse path={main} delay={0} colour="#fff" r={2.4} dur={3} />
      <Pulse path={main} delay={1.5} colour="rgba(255,255,255,0.7)" r={2} dur={3} />
    </Frame>
  );
}







/* ------------------------------------------------------------------ */
/* The fallback — a model stacking up, with sheets coming off it        */
/* ------------------------------------------------------------------ */

function BimRevit({ seed }: SceneProps) {
  const floors = seed > 0.5 ? [0, 9, 18] : [0, 12];

  return (
    <Frame label="A model stacking up, with sheets coming off it">
      <Plate size={28} />

      {floors.map((z, index) => {
        const storey = box(-24, -18, 26, 22, z + 8);
        return (
          <g
            key={z}
            className="animate-scene-in"
            style={d(index * 300)}
            stroke={LINE}
            strokeWidth="0.9"
          >
            <path d={storey.left} fill="rgba(147,205,253,0.1)" />
            <path d={storey.right} fill="rgba(147,205,253,0.18)" />
            <path d={storey.top} fill="rgba(147,205,253,0.24)" />
          </g>
        );
      })}

      {/* The sheet set it publishes to. */}
      {[0, 1, 2].map((index) => (
        <g
          key={index}
          className="animate-scene-in"
          style={d(900 + index * 320)}
          transform={`translate(${index * 7} ${-index * 6})`}
        >
          <rect
            x="214"
            y="52"
            width="62"
            height="46"
            rx="2"
            fill="rgba(6,20,34,0.85)"
            stroke={LINE}
            strokeWidth="0.9"
          />
          <path d="M220 62h34M220 68h44M220 74h28M220 80h40" stroke={FAINT} strokeWidth="1.4" />
          <path
            d="M220 88h22"
            stroke={BRAND}
            strokeWidth="2.2"
            className="animate-scene-bar"
            style={{ ...d(1200 + index * 320), transformOrigin: "220px 88px" }}
          />
        </g>
      ))}
    </Frame>
  );
}

/* ------------------------------------------------------------------ */

/** One scene per discipline; BimRevit stands in for anything unmapped. */
const BY_DISCIPLINE: Record<DisciplineId, (props: SceneProps) => ReactNode> = {
  architecture: Architecture,
  structure: Structure,
  mep: Hvac,
};

export function DisciplineScene({
  discipline,
  toolId,
}: {
  discipline: DisciplineId;
  toolId: string;
}) {
  const Scene = BY_DISCIPLINE[discipline] ?? BimRevit;
  return <Scene seed={seedFrom(toolId)} />;
}

export default DisciplineScene;
