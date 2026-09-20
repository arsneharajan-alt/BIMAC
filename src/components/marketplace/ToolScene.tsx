import type { ReactNode } from "react";
import { ARCHITECTURE_SCENES } from "./ArchitectureScenes";
import CardScene from "./CardScene";
import DESIGNED_CARD_IDS from "./cards/ids";
import DisciplineScene from "./DisciplineScene";
import { BRAND, BRAND_DEEP, FAINT, Frame, INK, LINE, d } from "./scene-kit";
import { cn } from "@/lib/utils";
import type { DisciplineId } from "@/types";

/**
 * What each featured tool actually does, drawn the way the work is drawn.
 *
 * A card with a glyph on a white field tells a visitor nothing. Each of these
 * plays the tool's story on a nine-second loop instead, in the conventions the
 * audience already reads: double-line walls, poché and door swings on the CAD
 * sheet; duct runs with centrelines and diffusers in the ceiling grid; pendant
 * heads inside their coverage circles; a floor plate with a core.
 *
 * A handful of tools are drawn by hand here, and CAD-to-Revit brings its own
 * card with it — a mocked Revit session, ported whole from the standalone
 * design. Every other tool takes its discipline's scene from
 * `DisciplineScene`, so no card is ever an icon.
 *
 * No words in the drawn artwork — the card's own title is the only text on it,
 * so the drawing has to carry itself.
 *
 * The canvas, the palette and the clock all come from `scene-kit`.
 */

/* ------------------------------------------------------------------ */
/* Shared services plan — duct and sprinkler are the same floor        */
/* ------------------------------------------------------------------ */

const SERVICE_ROOMS: [number, number, number, number][] = [
  [18, 30, 128, 44],
  [18, 80, 128, 44],
  [174, 30, 128, 44],
  [174, 80, 128, 44],
];

function ServicePlan() {
  return (
    <g>
      {SERVICE_ROOMS.map(([x, y, w, h]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={w} height={h} fill="rgba(255,255,255,0.025)" stroke={LINE} strokeWidth="0.9" />
          {/* The ceiling grid the services are set out against. */}
          <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} fill="url(#ceiling-grid)" />
        </g>
      ))}
      {/* Corridor between the two banks of rooms */}
      <rect x="146" y="30" width="28" height="94" fill="rgba(147,205,253,0.05)" stroke={FAINT} strokeWidth="0.6" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Duct layout — plant, trunk, branches, diffusers                  */
/* ------------------------------------------------------------------ */

/** A rectangular duct run: the duct body, then its centreline. */
function Duct({ d: path, width, len, delay }: { d: string; width: number; len: number; delay: number }) {
  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="rgba(245,95,22,0.55)"
        strokeWidth={width}
        strokeLinejoin="round"
        strokeDasharray={len}
        className="animate-draw"
        style={{ ...d(delay), ["--draw-length" as string]: len }}
      />
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="0.6"
        strokeDasharray="6 4"
        className="animate-scene-in"
        style={d(delay + 200)}
      />
    </g>
  );
}

function DuctLayout() {
  const branches = [
    { d: "M160 52H92", len: 68, delay: 1500 },
    { d: "M160 102H92", len: 68, delay: 1700 },
    { d: "M160 52h68", len: 68, delay: 1900 },
    { d: "M160 102h68", len: 68, delay: 2100 },
  ];

  const diffusers: [number, number, number][] = [
    [72, 52, 2600],
    [72, 102, 2750],
    [248, 52, 2900],
    [248, 102, 3050],
  ];

  return (
    <Frame label="Ductwork generated from an empty Revit plan: plant, trunk, branches and diffusers">
      <ServicePlan />

      {/* Plant: the air handler the system comes off */}
      <g className="animate-scene-in" style={d(600)}>
        <rect x="150" y="58" width="20" height="38" rx="2" fill="rgba(147,205,253,0.16)" stroke={LINE} strokeWidth="0.9" />
        <path d="M154 64h12M154 68h12M154 72h12M154 76h12" stroke={LINE} strokeWidth="0.7" />
      </g>

      {/* Trunk out of the plant, then the branch runs */}
      <Duct d="M160 58V38" width={9} len={20} delay={900} />
      <Duct d="M160 38v80" width={9} len={80} delay={1000} />
      {branches.map((b) => (
        <Duct key={b.d} d={b.d} width={6} len={b.len} delay={b.delay} />
      ))}

      {/* Air on the move */}
      {[
        { path: "M160 42v70", begin: "3.4s" },
        { path: "M156 52H96", begin: "3.9s" },
        { path: "M164 102h60", begin: "4.3s" },
      ].map((flow) => (
        <path key={flow.path} d="M0 0l5 2.5L0 5z" fill="#fff" opacity="0.85">
          <animateMotion dur="2.2s" begin={flow.begin} repeatCount="indefinite" path={flow.path} rotate="auto" />
        </path>
      ))}

      {/* Diffusers, set into the ceiling grid */}
      {diffusers.map(([x, y, delay]) => (
        <g key={`${x}-${y}`} className="animate-scene-pop" style={{ ...d(delay), transformOrigin: `${x}px ${y}px` }}>
          <rect x={x - 10} y={y - 10} width="20" height="20" rx="1.5" fill="rgba(251,124,60,0.2)" stroke={BRAND} strokeWidth="1" />
          <rect x={x - 6} y={y - 6} width="12" height="12" fill="none" stroke={BRAND} strokeWidth="0.7" />
          <path
            d={`M${x - 10} ${y - 10}l4 4M${x + 10} ${y - 10}l-4 4M${x - 10} ${y + 10}l4-4M${x + 10} ${y + 10}l-4-4`}
            stroke={BRAND}
            strokeWidth="0.7"
          />
        </g>
      ))}
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Sprinkler layout — heads to coverage, then the pipe that feeds   */
/* ------------------------------------------------------------------ */

function SprinklerLayout() {
  const heads: [number, number, number][] = [
    [54, 52, 500],
    [110, 52, 650],
    [54, 102, 800],
    [110, 102, 950],
    [210, 52, 1100],
    [266, 52, 1250],
    [210, 102, 1400],
    [266, 102, 1550],
  ];

  const pipes = [
    { d: "M160 40v76", len: 76, delay: 2100 },
    { d: "M160 52H54", len: 106, delay: 2300 },
    { d: "M160 102H54", len: 106, delay: 2500 },
    { d: "M160 52h106", len: 106, delay: 2700 },
    { d: "M160 102h106", len: 106, delay: 2900 },
  ];

  return (
    <Frame label="Sprinkler heads set out to coverage, then the branch pipework that feeds them">
      <ServicePlan />

      {/* Coverage circles land first — the rule the layout answers to */}
      {heads.map(([x, y, delay]) => (
        <circle
          key={`c-${x}-${y}`}
          cx={x}
          cy={y}
          r="25"
          fill="rgba(251,124,60,0.05)"
          stroke="rgba(251,124,60,0.35)"
          strokeWidth="0.7"
          strokeDasharray="3 3"
          className="animate-scene-in"
          style={d(delay + 300)}
        />
      ))}

      {/* Branch pipework, drawn back to the riser */}
      {pipes.map((pipe) => (
        <g key={pipe.d}>
          <path
            d={pipe.d}
            fill="none"
            stroke={BRAND_DEEP}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeDasharray={pipe.len}
            className="animate-draw"
            style={{ ...d(pipe.delay), ["--draw-length" as string]: pipe.len }}
          />
          <path
            d={pipe.d}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.7"
            strokeDasharray={pipe.len}
            className="animate-draw"
            style={{ ...d(pipe.delay), ["--draw-length" as string]: pipe.len }}
          />
        </g>
      ))}

      {/* Riser, and the tees off it */}
      <g className="animate-scene-pop" style={{ ...d(1900), transformOrigin: "160px 77px" }}>
        <circle cx="160" cy="77" r="7" fill="rgba(245,95,22,0.25)" stroke={BRAND_DEEP} strokeWidth="1.2" />
        <circle cx="160" cy="77" r="2.6" fill={BRAND_DEEP} />
      </g>
      {[52, 102].map((y) => (
        <rect
          key={y}
          x="156"
          y={y - 3}
          width="8"
          height="6"
          fill={BRAND_DEEP}
          className="animate-scene-in"
          style={d(3000)}
        />
      ))}

      {/* Pendant heads: body, deflector, frame arms */}
      {heads.map(([x, y, delay]) => (
        <g key={`h-${x}-${y}`} className="animate-scene-pop" style={{ ...d(delay), transformOrigin: `${x}px ${y}px` }}>
          <circle cx={x} cy={y} r="4.6" fill="rgba(7,23,38,0.9)" stroke={BRAND} strokeWidth="1.2" />
          <circle cx={x} cy={y} r="1.6" fill={BRAND} />
          <path
            d={`M${x - 4.6} ${y}h-3M${x + 4.6} ${y}h3M${x} ${y - 4.6}v-3M${x} ${y + 4.6}v3`}
            stroke={BRAND}
            strokeWidth="0.8"
          />
        </g>
      ))}
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Clash detection — flagged in the 3D view, then flown to          */
/* ------------------------------------------------------------------ */

/** The point the pipe and the column occupy at the same time. */
const CLASH_X = 150;
const CLASH_Y = 100;

/** How far the view flies in, and the pan that keeps the clash in the middle. */
const ZOOM = 2.1;
const PAN = `${(CLASH_X * (1 - ZOOM)).toFixed(1)} ${(CLASH_Y * (1 - ZOOM)).toFixed(1)}`;

/** Wide, wide, in, held, out, out — the view's whole nine seconds. */
const VIEW_TIMES = "0;0.54;0.66;0.86;0.97;1";
const VIEW_SPLINES = "0 0 1 1;0.22 1 0.36 1;0 0 1 1;0.5 0 0.2 1;0 0 1 1";

function ClashDetection() {
  return (
    <Frame label="A pipe running through a column, flagged, clicked and zoomed in on">
      {/* The fade masks the loop's reset, so the pipe never blinks back. */}
      <g className="animate-scene-in">
        {/* The view: pans and zooms as one, about the clash itself. Scaling by
            Z about (x,y) is a translate to x(1-Z), y(1-Z) with the scale under
            it, which is why the two numbers below are not arbitrary. */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0 0; 0 0; ${PAN}; ${PAN}; 0 0; 0 0`}
            keyTimes={VIEW_TIMES}
            dur="9s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines={VIEW_SPLINES}
          />
          <g>
            <animateTransform
              attributeName="transform"
              type="scale"
              values={`1; 1; ${ZOOM}; ${ZOOM}; 1; 1`}
              keyTimes={VIEW_TIMES}
              dur="9s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines={VIEW_SPLINES}
            />

            {/* The pipe, run in from the low end. It is drawn before the
                structure so the column reads as solid around it. */}
            <g>
              <path
                d="M90 130L210 70"
                stroke={BRAND}
                strokeWidth="7"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="1; 1; 0; 0"
                  keyTimes="0;0.07;0.24;1"
                  dur="9s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0 0 1 1;0.22 1 0.36 1;0 0 1 1"
                />
              </path>
              <path
                d="M90 130L210 70"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="0.9"
                strokeDasharray="6 6"
              />
            </g>

            {/* The column it runs through, and the beam it carries. Both are
                part-transparent, the way a clash view is set up to be. */}
            <g stroke={LINE} strokeWidth="0.9">
              <path d="M138 126L150 132L150 64L138 58Z" fill="rgba(147,205,253,0.1)" />
              <path d="M150 132L162 126L162 58L150 64Z" fill="rgba(147,205,253,0.17)" />
              <path d="M138 58L150 64L162 58L150 52Z" fill="rgba(147,205,253,0.24)" />
            </g>
            <g stroke={LINE} strokeWidth="0.9">
              <path d="M98 84L218 24L218 33L98 93Z" fill="rgba(147,205,253,0.14)" />
              <path d="M90 80L210 20L218 24L98 84Z" fill="rgba(147,205,253,0.22)" />
            </g>

            {/* The length of pipe that is inside the column — the clash itself,
                drawn over the structure because that is the whole point. */}
            <path
              d="M138 106L162 94"
              stroke={BRAND_DEEP}
              strokeWidth="7"
              strokeLinecap="butt"
              opacity="0.95"
            />
            <path d="M138 106L162 94" stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />

            {/* Marked where the two disagree. */}
            <g>
              <animate
                attributeName="opacity"
                values="0; 0; 1; 1"
                keyTimes="0;0.25;0.3;1"
                dur="9s"
                repeatCount="indefinite"
              />
              <circle
                cx={CLASH_X}
                cy={CLASH_Y}
                r="13"
                fill="rgba(245,95,22,0.2)"
                stroke={BRAND_DEEP}
                strokeWidth="1.6"
              />
              <circle cx={CLASH_X} cy={CLASH_Y} r="2.4" fill="#fff" />
            </g>

            {/* The flag on it. */}
            <g>
              <animate
                attributeName="opacity"
                values="0; 0; 1; 1"
                keyTimes="0;0.29;0.34;1"
                dur="9s"
                repeatCount="indefinite"
              />
              <path d={`M${CLASH_X} ${CLASH_Y - 12}V66`} stroke="#fff" strokeWidth="1.5" />
              <path d={`M${CLASH_X} 66l16 5-16 5z`} fill={BRAND_DEEP} stroke="#fff" strokeWidth="0.8" />
            </g>
          </g>
        </g>
      </g>

      {/* The pointer. Outside the view, because a cursor does not zoom with the
          model — it goes to the flag, presses it, and the view answers. */}
      <g>
        <animate
          attributeName="opacity"
          values="0; 0; 1; 1; 0; 0"
          keyTimes="0;0.34;0.4;0.57;0.62;1"
          dur="9s"
          repeatCount="indefinite"
        />
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="248 152; 248 152; 154 68; 158 72; 154 68; 154 68"
            keyTimes="0;0.34;0.5;0.53;0.56;1"
            dur="9s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0 0 1 1;0.22 1 0.36 1;0.4 0 0.6 1;0.4 0 0.6 1;0 0 1 1"
          />
          <path
            d="M0 0v15l3.6-3.6 2.8 5.6 3.3-1.7-2.8-5.4H11z"
            fill="#fff"
            stroke={INK}
            strokeWidth="0.7"
          />
        </g>
        {/* The press itself. */}
        <circle cx="158" cy="72" r="4" fill="none" stroke="#fff" strokeWidth="1.4">
          <animate
            attributeName="r"
            values="3;3;17;17"
            keyTimes="0;0.52;0.6;1"
            dur="9s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0 0 1 1;0.22 1 0.36 1;0 0 1 1"
          />
          <animate
            attributeName="opacity"
            values="0;0;0.9;0;0"
            keyTimes="0;0.52;0.54;0.6;1"
            dur="9s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */

const SCENES: Record<string, (props: { className?: string }) => ReactNode> = {
  "hvac-modeling": DuctLayout,
  "sprinkler-layout": SprinklerLayout,
  "revit-clash-detection": ClashDetection,
  // Architecture is the discipline a visitor scrolls furthest through, so
  // every one of its tools is drawn rather than falling back to one picture.
  ...ARCHITECTURE_SCENES,
};

/**
 * A tool that ships a finished card of its own.
 *
 * Those carry their own name, their own copy and their own call to action, so
 * the card puts nothing around them — anything it added would be a second
 * version of what the design already says. They are also drawn on a light
 * ground, which the card needs to know: white type over white artwork is not
 * type, so the number and the plate behind the drawing both flip for these.
 */
export function hasFullCardScene(toolId: string): boolean {
  return DESIGNED_CARD_IDS.has(toolId);
}

export function hasLightScene(toolId: string): boolean {
  return hasFullCardScene(toolId);
}

/** True when a tool has a scene drawn for it by hand. */
export function hasToolScene(toolId: string): boolean {
  return toolId in SCENES;
}

export function ToolScene({
  toolId,
  discipline,
  className,
}: {
  toolId: string;
  /** Which scene a tool without one of its own falls back to. */
  discipline: DisciplineId;
  className?: string;
}) {
  const designed = DESIGNED_CARD_IDS.has(toolId);
  const Scene = SCENES[toolId];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 overflow-hidden",
        hasLightScene(toolId) ? "bg-white" : "bg-ink-950",
        // Held on its first frame for anyone who has asked for less motion.
        "motion-reduce:[&_*]:!animate-none",
        className,
      )}
    >
      {designed ? (
        <CardScene toolId={toolId} />
      ) : Scene ? (
        <Scene />
      ) : (
        <DisciplineScene discipline={discipline} toolId={toolId} />
      )}
    </div>
  );
}

export default ToolScene;
