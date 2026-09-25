"use client";

import type { CSSProperties, ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import { TitleBar } from "@/components/ui/StackedHeading";
import { GLOSS, LIFT } from "@/components/ui/Gloss";
import { cn } from "@/lib/utils";
import { easeOut, loopFade, ramp, useLoop } from "@/lib/use-loop";

/**
 * Three automations, each shown doing its job.
 *
 * Every card is one story on a loop — input, the plugin working, the result —
 * drawn on a white stage in the site's own palette, one colour per discipline.
 * The three steps under the
 * picture light up in time with it, and each is a button: click one and the
 * story jumps to that part.
 */

/* ------------------------------------------------------------------ */
/* Palette — light ground, one colour per discipline                  */
/* ------------------------------------------------------------------ */

const LINE = "#63788D";
const FAINT = "#C9D5E0";
const BRAND = "#FB7C3C";
const ARCH = "#FB7C3C";
const STRUCT = "#2E92F0";
const MEP = "#14B8A6";
const OK = "#10B981";

function Stage({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 320 200" role="img" aria-label={label} className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="demo-ground" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F3F7FA" />
        </linearGradient>
        <pattern id="demo-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" stroke="rgba(23,93,173,0.06)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="320" height="200" fill="url(#demo-ground)" />
      <rect width="320" height="200" fill="url(#demo-grid)" />
      {children}
    </svg>
  );
}

/** A small label on the stage. */
function Label({ x, y, children, tone = "muted", anchor = "middle", size = 7.5 }: {
  x: number;
  y: number;
  children: ReactNode;
  tone?: "muted" | "white" | "light" | "brand" | "ok";
  anchor?: "start" | "middle" | "end";
  size?: number;
}) {
  const fill = { muted: "#63788D", white: "#0F2131", light: "#FFFFFF", brand: "#E24709", ok: "#059669" }[tone];
  return (
    <text x={x} y={y} textAnchor={anchor} fill={fill} style={{ fontSize: size, fontWeight: tone === "muted" ? 500 : 600 }}>
      {children}
    </text>
  );
}

/** Packets riding a straight wire while `on`. */
function Packets({ x1, x2, y, t, on }: { x1: number; x2: number; y: number; t: number; on: boolean }) {
  if (!on) return null;
  return (
    <g>
      {[0, 1, 2].map((k) => {
        const f = (t * 5 + k / 3) % 1;
        return <circle key={k} cx={x1 + (x2 - x1) * f} cy={y} r="2" fill={BRAND} opacity={Math.sin(f * Math.PI)} />;
      })}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Exporting sheets                                                  */
/* ------------------------------------------------------------------ */

const EXPORT_STEPS: [number, number] = [0.16, 0.78];

function ExportSheets({ p }: { p: number }) {
  const run = ramp(p, EXPORT_STEPS[0], EXPORT_STEPS[1]);
  const running = p >= EXPORT_STEPS[0] && p < EXPORT_STEPS[1];
  const done = p >= EXPORT_STEPS[1];
  const sheets = run * 6;
  const shown = Math.floor(sheets);
  const arriving = sheets % 1;
  const fade = loopFade(p);
  const model = easeOut(ramp(p, 0.01, 0.12));

  return (
    <Stage label="A model goes in, the plugin exports the sheet set, and a stack of PDF and DWG sheets comes out.">
      <g opacity={fade}>
        {/* The model */}
        <g opacity={model} transform={`translate(0 ${(1 - model) * 6})`}>
          <rect x="18" y="52" width="80" height="92" rx="8" fill="#FFFFFF" stroke={p < EXPORT_STEPS[0] ? BRAND : FAINT} />
          <g fill="none" stroke={LINE} strokeWidth="0.9" strokeLinejoin="round">
            <path d="M58 72 82 84 58 96 34 84Z" />
            <path d="M34 84v34l24 12 24-12V84" />
            <path d="M58 96v34" />
            {[94, 104, 114].map((y) => (
              <path key={y} d={`M34 ${y} 58 ${y + 12} 82 ${y}`} stroke={FAINT} />
            ))}
          </g>
          <Label x={58} y={160}>Tower_A.rvt</Label>
        </g>

        {/* Wires */}
        <path d="M98 98H132M188 98H214" stroke={FAINT} strokeWidth="1" />
        <Packets x1={98} x2={132} y={98} t={p} on={running} />
        <Packets x1={188} x2={214} y={98} t={p + 0.5} on={running} />

        {/* The plugin, with its progress ring */}
        <circle cx="160" cy="98" r="28" fill="rgba(251,124,60,0.08)" stroke={FAINT} />
        <circle
          cx="160"
          cy="98"
          r="28"
          fill="none"
          stroke={done ? OK : BRAND}
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - run}
          transform="rotate(-90 160 98)"
        />
        {done ? (
          <path d="M150 98l7 7 13-14" fill="none" stroke={OK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <Label x={160} y={101} tone="white" size={11}>
            {Math.round(run * 100)}%
          </Label>
        )}
        <Label x={160} y={142} tone={done ? "ok" : running ? "brand" : "muted"}>
          {done ? "Complete" : running ? "Exporting…" : "Batch Export"}
        </Label>

        {/* The sheets, stacking up */}
        {Array.from({ length: 6 }).map((_, i) => {
          const visible = done || i < shown || (i === shown && running);
          if (!visible) return null;
          const t = !done && i === shown ? easeOut(arriving) : 1;
          const x = 222 + i * 6;
          const y = 118 - i * 8;
          return (
            <g key={i} opacity={t} transform={`translate(${(1 - t) * -14} 0)`}>
              <rect x={x} y={y} width="56" height="40" rx="2" fill="#FFFFFF" stroke="#B7C6D5" strokeWidth="0.6" />
              <path d={`M${x + 42} ${y}v40`} stroke="#B7C6D5" strokeWidth="0.5" />
              <path
                d={`M${x + 6} ${y + 8}h30v24h-30zM${x + 6} ${y + 20}h18M${x + 24} ${y + 8}v24`}
                fill="none"
                stroke="#3B4D5F"
                strokeWidth="0.7"
              />
              <rect x={x + 44} y={y + 30} width="10" height="6" rx="1" fill={i % 2 ? STRUCT : BRAND} />
              <text x={x + 49} y={y + 34.6} textAnchor="middle" fill="#fff" style={{ fontSize: 3.6, fontWeight: 700 }}>
                {i % 2 ? "DWG" : "PDF"}
              </text>
            </g>
          );
        })}
        <Label x={258} y={178} tone={done ? "ok" : "muted"}>
          {`${Math.round(run * 48)} / 48 sheets`}
        </Label>
      </g>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* 2. AutoCAD → Revit                                                   */
/* ------------------------------------------------------------------ */

const CAD_STEPS: [number, number] = [0.26, 0.44];

/** The plan, in a 100×80 box, shared by the drawing and the model. */
const PLAN_WALLS: [number, number, number, number][] = [
  [0, 0, 100, 0],
  [0, 0, 0, 80],
  [55, 0, 55, 80],
  [100, 0, 100, 80],
  [0, 80, 100, 80],
];
const PLAN_COLUMNS: [number, number][] = [
  [0, 0],
  [55, 0],
  [100, 0],
  [0, 80],
  [55, 80],
  [100, 80],
];

/** Plan → the drawing on the left. */
const cad = (x: number, y: number): [number, number] => [26 + x * 1.08, 58 + y * 1.1];

/** Plan → the isometric model on the right. */
function iso(x: number, y: number, z: number): [number, number] {
  const s = 0.62;
  return [236 + (x - y) * 0.866 * s, 84 + (x + y) * 0.5 * s - z];
}
const pts = (list: [number, number][]) => list.map((pt) => pt.join(",")).join(" ");

function CadToRevit({ p }: { p: number }) {
  const lines = easeOut(ramp(p, 0.02, 0.24));
  const scan = ramp(p, CAD_STEPS[0], CAD_STEPS[1]);
  const converting = p >= CAD_STEPS[0] && p < CAD_STEPS[1];
  const walls = easeOut(ramp(p, 0.44, 0.58));
  const frame = easeOut(ramp(p, 0.58, 0.7));
  const ducts = easeOut(ramp(p, 0.7, 0.82));
  const fade = loopFade(p);
  const H = 30;

  // Back to front, so nearer walls are drawn over farther ones.
  const orderedWalls = [...PLAN_WALLS].sort((a, b) => a[0] + a[1] + a[2] + a[3] - (b[0] + b[1] + b[2] + b[3]));

  const chips: { label: string; color: string; on: number }[] = [
    { label: "Architecture", color: ARCH, on: walls },
    { label: "Structure", color: STRUCT, on: frame },
    { label: "MEP", color: MEP, on: ducts },
  ];

  return (
    <Stage label="An AutoCAD plan is read and rebuilt as a Revit model: walls, then columns and beams, then ductwork.">
      <g opacity={fade}>
        {/* The drawing */}
        <rect x="12" y="28" width="140" height="138" rx="8" fill="#FFFFFF" stroke={FAINT} />
        <rect x="20" y="36" width="22" height="10" rx="2" fill="#22333F" />
        <Label x={31} y={43.5} tone="light" size={6}>DWG</Label>
        <Label x={48} y={43.5} anchor="start" size={6.5}>Level_02.dwg</Label>
        <g fill="none" strokeLinecap="square">
          {PLAN_WALLS.map(([x1, y1, x2, y2]) => {
            const [a, b] = cad(x1, y1);
            const [c, d] = cad(x2, y2);
            return (
              <path
                key={`${x1}${y1}${x2}${y2}`}
                d={`M${a} ${b}L${c} ${d}`}
                stroke="#22333F"
                strokeWidth="1.3"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - lines}
              />
            );
          })}
          {PLAN_COLUMNS.map(([x, y]) => {
            const [a, b] = cad(x, y);
            return <rect key={`${x}-${y}`} x={a - 2.5} y={b - 2.5} width="5" height="5" stroke={STRUCT} strokeWidth="0.9" opacity={lines} />;
          })}
          {(() => {
            const [a, b] = cad(4, 40);
            const [c] = cad(96, 40);
            return <path d={`M${a} ${b}H${c}`} stroke={MEP} strokeWidth="0.9" strokeDasharray="4 2" opacity={lines} />;
          })()}
        </g>
        {converting ? (
          <g>
            <rect x={20 + scan * 124} y="52" width="2" height="104" fill={BRAND} />
            <rect x={20 + scan * 124 - 22} y="52" width="22" height="104" fill="url(#demo-scan)" />
            <defs>
              <linearGradient id="demo-scan" x1="0" x2="1">
                <stop offset="0%" stopColor={BRAND} stopOpacity="0" />
                <stop offset="100%" stopColor={BRAND} stopOpacity="0.25" />
              </linearGradient>
            </defs>
          </g>
        ) : null}

        {/* The hand-over */}
        <path d="M152 97H168" stroke={FAINT} />
        <Packets x1={152} x2={168} y={97} t={p} on={converting} />

        {/* The model */}
        <rect x="168" y="28" width="140" height="138" rx="8" fill="#FFFFFF" stroke={FAINT} />
        <rect x="176" y="36" width="22" height="10" rx="2" fill="#2E92F0" />
        <Label x={187} y={43.5} tone="light" size={6}>RVT</Label>
        {/* Floor slab */}
        <polygon
          points={pts([iso(0, 0, 0), iso(100, 0, 0), iso(100, 80, 0), iso(0, 80, 0)])}
          fill="rgba(46,146,240,0.06)"
          stroke={FAINT}
          opacity={ramp(p, 0.42, 0.48)}
        />
        {/* Walls — architecture */}
        {walls > 0
          ? orderedWalls.map(([x1, y1, x2, y2]) => (
              <polygon
                key={`w${x1}${y1}${x2}${y2}`}
                points={pts([iso(x1, y1, 0), iso(x2, y2, 0), iso(x2, y2, H * walls), iso(x1, y1, H * walls)])}
                fill="rgba(251,124,60,0.16)"
                stroke={ARCH}
                strokeOpacity="0.8"
                strokeWidth="0.7"
              />
            ))
          : null}
        {/* Columns and beams — structure */}
        {frame > 0 ? (
          <g stroke={STRUCT} strokeLinecap="round">
            {PLAN_COLUMNS.map(([x, y]) => {
              const [a, b] = iso(x, y, 0);
              const [, d] = iso(x, y, (H + 4) * frame);
              return <path key={`c${x}${y}`} d={`M${a} ${b}V${d}`} strokeWidth="2.2" />;
            })}
            {[0, 80].map((y) => {
              const [a, b] = iso(0, y, H + 4);
              const [c, d] = iso(100 * frame, y, H + 4);
              return <path key={`b${y}`} d={`M${a} ${b}L${c} ${d}`} strokeWidth="1.8" />;
            })}
          </g>
        ) : null}
        {/* Ductwork — MEP */}
        {ducts > 0 ? (
          <g stroke={MEP} strokeLinecap="round">
            {(() => {
              const [a, b] = iso(4, 40, H - 6);
              const [c, d] = iso(4 + 92 * ducts, 40, H - 6);
              return <path d={`M${a} ${b}L${c} ${d}`} strokeWidth="3.2" />;
            })()}
            {[27, 77].map((x) => {
              if (ducts < x / 100) return null;
              const [a, b] = iso(x, 40, H - 6);
              const [, d] = iso(x, 40, H - 14);
              return <path key={x} d={`M${a} ${b}V${d}`} strokeWidth="1.6" />;
            })}
          </g>
        ) : null}

        {/* What has been built so far */}
        {chips.map((chip, index) => (
          <g key={chip.label} transform={`translate(${176 + [0, 54, 100][index]} 150)`} opacity={0.35 + 0.65 * (chip.on > 0 ? 1 : 0)}>
            <circle cx="3" cy="3" r="2.5" fill={chip.color} />
            <Label x={8} y={5.6} anchor="start" size={6} tone={chip.on > 0 ? "white" : "muted"}>
              {chip.label}
            </Label>
          </g>
        ))}
        <Label x={160} y={184} tone={p >= 0.84 ? "ok" : converting ? "brand" : "muted"}>
          {p >= 0.84 ? "Revit model ready" : converting ? "Reading layers & blocks…" : p >= CAD_STEPS[1] ? "Building elements…" : "AutoCAD drawing"}
        </Label>
      </g>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* 3. A whole workflow                                                  */
/* ------------------------------------------------------------------ */

const FLOW_STEPS: [number, number] = [0.12, 0.7];

const FLOW_NODES: { x: number; label: string; result: string }[] = [
  { x: 40, label: "Read data", result: "1,240 rows" },
  { x: 120, label: "Validate", result: "0 errors" },
  { x: 200, label: "Create views", result: "36 views" },
  { x: 280, label: "Place sheets", result: "24 sheets" },
];

function NodeGlyph({ index, x, y, color }: { index: number; x: number; y: number; color: string }) {
  const common = { fill: "none", stroke: color, strokeWidth: 1.1, strokeLinejoin: "round" as const };
  switch (index) {
    case 0:
      return <path d={`M${x - 6} ${y - 5}h12v10h-12zM${x - 6} ${y - 1.5}h12M${x - 6} ${y + 2}h12M${x - 1} ${y - 5}v10`} {...common} />;
    case 1:
      return <path d={`M${x - 5} ${y}l3.5 3.5 6.5-7`} {...common} strokeWidth={1.6} strokeLinecap="round" />;
    case 2:
      return <path d={`M${x - 7} ${y}c3-5 11-5 14 0c-3 5-11 5-14 0zM${x} ${y}m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0`} {...common} />;
    default:
      return <path d={`M${x - 5} ${y - 6}h10v12h-10zM${x - 3} ${y - 3}h6M${x - 3} ${y}h6M${x - 3} ${y + 3}h4`} {...common} />;
  }
}

function Workflow({ p }: { p: number }) {
  const travel = ramp(p, FLOW_STEPS[0], FLOW_STEPS[1]);
  const head = 40 + 240 * travel;
  const input = easeOut(ramp(p, 0.01, 0.1));
  const deliver = easeOut(ramp(p, FLOW_STEPS[1], FLOW_STEPS[1] + 0.1));
  const fade = loopFade(p);

  return (
    <Stage label="Project data runs through four automated stages — read, validate, create views, place sheets — and comes out as a finished issue pack.">
      <g opacity={fade}>
        {/* The input */}
        <g opacity={input} transform={`translate(0 ${(1 - input) * -6})`}>
          <rect x="16" y="14" width="96" height="22" rx="5" fill="#FFFFFF" stroke={p < FLOW_STEPS[0] ? BRAND : FAINT} />
          <rect x="22" y="19.5" width="11" height="11" rx="2" fill="#1D6F42" />
          <Label x={27.5} y={27.4} tone="light" size={6}>X</Label>
          <Label x={38} y={27.4} anchor="start" size={6.8}>Project_Data.xlsx</Label>
          <path d="M40 36V52" stroke={FAINT} strokeDasharray="2 2" />
        </g>

        {/* The line, and the automation running along it */}
        <path d="M40 70H280" stroke={FAINT} strokeWidth="1.2" />
        <path d={`M40 70H${head}`} stroke={BRAND} strokeWidth="1.6" opacity={travel > 0 ? 1 : 0} />
        {travel > 0 && travel < 1 ? <circle cx={head} cy="70" r="3.2" fill={BRAND} /> : null}

        {FLOW_NODES.map((node, index) => {
          const reached = travel > 0 && head >= node.x - 1;
          const active = reached && (index === FLOW_NODES.length - 1 ? travel < 1 : head < FLOW_NODES[index + 1].x);
          const color = active ? BRAND : reached ? OK : "#63788D";
          return (
            <g key={node.label}>
              <circle cx={node.x} cy="70" r="15" fill="#FFFFFF" stroke={color} strokeWidth={active ? 1.8 : 1.1} />
              {active ? <circle cx={node.x} cy="70" r="19" fill="none" stroke={BRAND} strokeOpacity="0.3" /> : null}
              <NodeGlyph index={index} x={node.x} y={70} color={reached ? (active ? BRAND : OK) : "#889CB0"} />
              <Label x={node.x} y={98} tone={reached ? "white" : "muted"} size={7}>
                {node.label}
              </Label>
              <Label x={node.x} y={108} tone={reached && !active ? "ok" : "muted"} size={6.2}>
                {reached && !active ? node.result : "—"}
              </Label>
            </g>
          );
        })}

        {/* The deliverable */}
        <g opacity={deliver} transform={`translate(0 ${(1 - deliver) * 10})`}>
          <path d="M280 110V128H236" stroke={deliver > 0 ? OK : FAINT} strokeOpacity="0.6" fill="none" strokeDasharray="2 2" />
          <rect x="84" y="120" width="152" height="54" rx="7" fill="rgba(52,211,153,0.07)" stroke={OK} strokeOpacity="0.55" />
          <path d="M98 130h14l5 5v28h-19z" fill="#E9EFF4" />
          <path d="M101 142h11M101 147h11M101 152h8" stroke="#63788D" strokeWidth="0.9" />
          <Label x={126} y={138} anchor="start" tone="white" size={8}>Issue_Pack_R03</Label>
          <Label x={126} y={150} anchor="start" size={6.4}>24 sheets · PDF · IFC · transmittal</Label>
          <rect x="126" y="156" width="30" height="10" rx="5" fill="rgba(52,211,153,0.18)" />
          <Label x={141} y={163.2} tone="ok" size={6}>Ready</Label>
        </g>
      </g>
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* The card                                                            */
/* ------------------------------------------------------------------ */

type Demo = {
  title: string;
  line: string;
  steps: [string, string, string];
  bounds: [number, number];
  loopMs: number;
  Visual: (props: { p: number }) => ReactNode;
};

const DEMOS: Demo[] = [
  {
    title: "Exporting Sheets",
    line: "A whole sheet set, named to your standard and written to PDF and DWG in one run.",
    steps: ["Project model", "Automated export", "Sheets issued"],
    bounds: EXPORT_STEPS,
    loopMs: 8000,
    Visual: ExportSheets,
  },
  {
    title: "AutoCAD → Revit",
    line: "CAD linework read layer by layer and rebuilt as real Revit walls, framing and ductwork.",
    steps: ["AutoCAD drawing", "Automated conversion", "Revit model"],
    bounds: CAD_STEPS,
    loopMs: 9000,
    Visual: CadToRevit,
  },
  {
    title: "Workflow Automation",
    line: "Several steps of a real workflow, chained — from project data to a finished issue pack.",
    steps: ["Project data", "Automated workflow", "Finished deliverable"],
    bounds: FLOW_STEPS,
    loopMs: 9000,
    Visual: Workflow,
  },
];

function DemoCard({ demo, index }: { demo: Demo; index: number }) {
  const { ref, p, seek } = useLoop(demo.loopMs, 0.9);
  const [b1, b2] = demo.bounds;
  const step = p < b1 ? 0 : p < b2 ? 1 : 2;
  const starts = [0, b1, b2];
  const Visual = demo.Visual;

  return (
    <article
      data-reveal=""
      style={{ "--reveal-delay": `${index * 100}ms` } as CSSProperties}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white ${GLOSS} ${LIFT} hover:border-brand-300`}
    >
      <div ref={ref} className="relative aspect-[16/10] overflow-hidden border-b border-ink-200 bg-white">
        <Visual p={p} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="font-mono text-[0.75rem] font-semibold tracking-wider text-brand-600">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-1.5 font-display text-card-title font-semibold text-ink-950 lg:text-card-title-lg">
          {demo.title}
        </h3>
        <TitleBar />
        <p className="mt-4 text-card-body text-ink-500">{demo.line}</p>

        {/* The steps: in time with the picture, and clickable. */}
        <ol className="mt-auto flex items-center gap-1 pt-6">
          {demo.steps.map((label, i) => (
            <li key={label} className="flex min-w-0 flex-1 items-center gap-1">
              <button
                type="button"
                onClick={() => seek(starts[i] + 0.005)}
                aria-label={`Show step ${i + 1}: ${label}`}
                className={cn(
                  "flex h-full w-full min-w-0 items-center justify-center gap-1 rounded-lg border px-1.5 py-2 text-center text-[0.6875rem] font-semibold leading-tight transition-colors duration-300",
                  i === step
                    ? "border-brand-300 bg-brand-50 text-brand-700"
                    : i < step
                      ? "border-ink-200 bg-white text-ink-700"
                      : "border-ink-200 bg-ink-50 text-ink-400 hover:text-ink-600",
                )}
              >
                {i < step ? <Icon name="check" className="shrink-0 text-[0.625rem] text-emerald-500" strokeWidth={3} /> : null}
                <span className="min-w-0">{label}</span>
              </button>
              {i < 2 ? <Icon name="chevron-right" className="shrink-0 text-[0.625rem] text-ink-300" /> : null}
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

export function ExampleDemos() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
      {DEMOS.map((demo, index) => (
        <DemoCard key={demo.title} demo={demo} index={index} />
      ))}
    </div>
  );
}

export default ExampleDemos;
