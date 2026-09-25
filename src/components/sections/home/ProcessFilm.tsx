"use client";

import type { ReactNode } from "react";
import { easeOut, loopFade, ramp, useLoop } from "@/lib/use-loop";

/**
 * What we build, as one film.
 *
 * It plays the two paragraphs above it, beat for beat, on a 16-second loop:
 *
 *   1. the same tasks, again and again — a pile of them, and a counter that
 *      runs into the hundreds;
 *   2. one plugin — the pile is pulled into the hub and becomes one action;
 *   3. across Architecture, Structure and MEP, from early design to as-built —
 *      a grid of deliverables, ticked off stage by stage as the run crosses it;
 *   4. what it buys — automate more, work smarter, greater consistency.
 *
 * Drawn in SVG on the site's own palette and driven by the one clock in
 * `useLoop`, so it is sharp at any width and weighs nothing.
 */

const LOOP_MS = 16000;

/* The beats, as points on the loop. */
const PILE: [number, number] = [0.02, 0.24];
const GATHER: [number, number] = [0.25, 0.35];
const RUN: [number, number] = [0.36, 0.8];
const OUTCOME: [number, number] = [0.8, 0.86];

const INK = "#0F2131";
const MUTED = "#63788D";
const LINE = "#C9D5E0";
const BRAND = "#F55F16";
const OK = "#10B981";

const TASKS = [
  "Rename sheets",
  "Place views",
  "Tag doors",
  "Export PDFs",
  "Update schedules",
  "Check naming",
  "Dimension grids",
  "Issue drawings",
];

const STAGES = ["Early design", "Design dev.", "Documentation", "Construction", "As-built"];

const DISCIPLINES: { label: string; color: string; tint: string }[] = [
  { label: "Architecture", color: "#F55F16", tint: "#FFF5ED" },
  { label: "Structure", color: "#2E92F0", tint: "#EFF7FF" },
  { label: "MEP", color: "#14B8A6", tint: "#F0FDFA" },
];

const OUTCOMES = ["Automate more", "Work smarter", "Greater consistency"];

/* Geometry of the grid. */
const HUB = { x: 420, y: 290 };
const ROW_Y = [200, 290, 380];
const COL_X = [700, 800, 900, 1000, 1100];
const CELL = { w: 82, h: 58 };

function Text({
  x,
  y,
  children,
  size = 14,
  weight = 500,
  fill = INK,
  anchor = "middle",
  opacity = 1,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  weight?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  opacity?: number;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={fill} opacity={opacity} style={{ fontSize: size, fontWeight: weight }}>
      {children}
    </text>
  );
}

/** The deliverable each discipline's row turns out, drawn small. */
function CellGlyph({ row, x, y, color }: { row: number; x: number; y: number; color: string }) {
  const common = { fill: "none", stroke: color, strokeWidth: 1.6, strokeLinejoin: "round" as const };
  if (row === 0)
    // A sheet with a plan on it.
    return <path d={`M${x - 11} ${y - 13}h22v26h-22zM${x - 7} ${y - 8}h14v10h-14zM${x} ${y - 8}v10M${x - 7} ${y + 7}h9`} {...common} />;
  if (row === 1)
    // Columns and a beam.
    return <path d={`M${x - 12} ${y - 10}h24M${x - 9} ${y - 10}v22M${x + 9} ${y - 10}v22M${x} ${y - 10}v22M${x - 12} ${y + 12}h24`} {...common} />;
  // A duct run with a branch.
  return <path d={`M${x - 13} ${y - 4}h26v8h-26zM${x - 2} ${y + 4}v8h6v-8M${x + 1} ${y - 4}v-8`} {...common} />;
}

export function ProcessFilm() {
  const { ref, p } = useLoop(LOOP_MS, 0.9);
  const fade = loopFade(p, 0.95);

  const pile = ramp(p, PILE[0], PILE[1]);
  const gather = easeOut(ramp(p, GATHER[0], GATHER[1]));
  const run = ramp(p, RUN[0], RUN[1]);
  const outcome = easeOut(ramp(p, OUTCOME[0], OUTCOME[1]));
  const hubOn = ramp(p, GATHER[0] + 0.04, GATHER[1]);
  const running = p >= RUN[0] && p < RUN[1];

  const cardsShown = Math.min(TASKS.length, Math.floor(pile * TASKS.length) + (pile > 0 ? 1 : 0));
  const repeats = Math.round(Math.pow(pile, 1.4) * 300);
  const marker = run * STAGES.length; // 0 → 5, across the columns
  const markerX = COL_X[0] - 50 + run * (COL_X[4] - COL_X[0] + 100);
  const cellsDone = ROW_Y.reduce(
    (n, _, r) => n + COL_X.filter((_, c) => marker > c + 0.35 + r * 0.18).length,
    0,
  );

  const caption =
    p < GATHER[0]
      ? "The same tasks, hundreds of times."
      : p < RUN[0]
        ? "One plugin takes them over."
        : p < OUTCOME[0]
          ? "Across Architecture, Structure and MEP — from early design to as-built."
          : "Automate more. Work smarter. Deliver with greater consistency.";

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-3xl border border-ink-200 bg-[linear-gradient(170deg,#FFFFFF_0%,#F3F7FA_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(6,20,34,0.05),0_14px_30px_-10px_rgba(6,20,34,0.14)]"
    >
      <svg
        viewBox="0 0 1200 600"
        role="img"
        aria-label="Repetitive tasks pile up by hand; a BIMAC plugin takes them over as one action, then produces deliverables for Architecture, Structure and MEP at every stage from early design to as-built, so teams automate more, work smarter and deliver with greater consistency."
        className="block h-auto w-full"
      >
        <defs>
          <pattern id="film-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="rgba(23,93,173,0.05)" strokeWidth="1" />
          </pattern>
          <radialGradient id="film-glow">
            <stop offset="0%" stopColor={BRAND} stopOpacity="0.28" />
            <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="600" fill="url(#film-grid)" />

        <g opacity={fade}>
          {/* The caption, top left: what this beat is saying. */}
          <Text x={48} y={62} size={22} weight={700} anchor="start">
            {caption}
          </Text>

          {/* ---------------- 1. The pile ---------------- */}
          <Text x={170} y={128} size={13} weight={700} fill={MUTED} anchor="middle" opacity={1 - gather}>
            BY HAND
          </Text>

          {/* Once the pile has gone into the hub, the left side keeps score:
              three hundred actions by hand, one with the plugin. */}
          <g opacity={easeOut(ramp(p, GATHER[1], GATHER[1] + 0.06))}>
            <Text x={170} y={250} size={44} weight={800} fill={LINE}>
              300
            </Text>
            <path d="M120 236H220" stroke={MUTED} strokeWidth="2.5" strokeLinecap="round" />
            <Text x={170} y={276} size={13} fill={MUTED}>
              repeated actions by hand
            </Text>
            <path d="M170 296v28M162 316l8 8 8-8" fill="none" stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Text x={170} y={384} size={44} weight={800} fill={BRAND}>
              1
            </Text>
            <Text x={170} y={410} size={13} weight={600} fill={INK}>
              action with a plugin
            </Text>
          </g>
          {TASKS.map((task, i) => {
            if (i >= cardsShown) return null;
            // Each card drops in, then is pulled into the hub in turn.
            const arrive = easeOut(ramp(pile, i / TASKS.length, i / TASKS.length + 0.12));
            const pull = easeOut(ramp(gather, i * 0.06, i * 0.06 + 0.5));
            // One straight column, centred on x=170 with the label and the counter.
            const x = 64 + pull * (HUB.x - 170);
            const y = 150 + i * 38 + (1 - arrive) * -12 + pull * (HUB.y - 170 - i * 38);
            return (
              <g key={task} opacity={arrive * (1 - pull)} transform={`translate(${x} ${y}) scale(${1 - pull * 0.6})`}>
                <rect width="212" height="30" rx="7" fill="#FFFFFF" stroke={LINE} />
                <rect x="10" y="9" width="12" height="12" rx="3" fill="none" stroke={MUTED} strokeWidth="1.4" />
                <Text x={32} y={20} size={13} anchor="start">
                  {task}
                </Text>
                <Text x={200} y={20} size={11} fill={MUTED} anchor="end">
                  ×{Math.max(1, Math.round(repeats / TASKS.length))}
                </Text>
              </g>
            );
          })}
          {/* The counter */}
          <g opacity={1 - gather}>
            <Text x={170} y={478} size={40} weight={800} fill={BRAND}>
              {repeats}
            </Text>
            <Text x={170} y={500} size={13} fill={MUTED}>
              repeated actions
            </Text>
          </g>

          {/* ---------------- 2. The hub ---------------- */}
          <circle cx={HUB.x} cy={HUB.y} r={96} fill="url(#film-glow)" opacity={hubOn} />
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r={62}
            fill="#FFFFFF"
            stroke={hubOn > 0 ? BRAND : LINE}
            strokeWidth={1.5 + hubOn * 1.5}
          />
          {running ? (
            <circle
              cx={HUB.x}
              cy={HUB.y}
              r={62 + ((p * 40) % 1) * 22}
              fill="none"
              stroke={BRAND}
              strokeOpacity={0.35 * (1 - ((p * 40) % 1))}
            />
          ) : null}
          <image href="/logos/bimac-mark.png" x={HUB.x - 46} y={HUB.y - 58} width={92} height={92} />
          <Text x={HUB.x} y={HUB.y + 30} size={13} weight={800} fill={BRAND}>
            300+ plugins
          </Text>
          <Text x={HUB.x} y={HUB.y + 90} size={13} weight={600} fill={hubOn > 0.5 ? INK : MUTED}>
            {p >= OUTCOME[0] ? "1 click" : running ? "Running…" : hubOn > 0 ? "One action" : "Waiting"}
          </Text>

          {/* ---------------- 3. The grid ---------------- */}
          {/* Hub to the three disciplines */}
          {ROW_Y.map((y, r) => {
            const d = `M${HUB.x + 62} ${HUB.y} C ${HUB.x + 110} ${HUB.y}, ${520} ${y}, ${560} ${y}`;
            return (
              <g key={`wire-${r}`}>
                <path d={d} fill="none" stroke={LINE} strokeWidth="1.5" />
                <path
                  d={d}
                  fill="none"
                  stroke={DISCIPLINES[r].color}
                  strokeWidth="2"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - ramp(p, RUN[0] - 0.02, RUN[0] + 0.04)}
                />
              </g>
            );
          })}

          {/* Stage headers, and the run crossing them */}
          {STAGES.map((stage, c) => (
            <Text
              key={stage}
              x={COL_X[c]}
              y={140}
              size={12.5}
              weight={700}
              fill={running && Math.floor(marker) === c ? BRAND : marker > c + 1 ? INK : MUTED}
            >
              {stage}
            </Text>
          ))}
          <path d={`M${COL_X[0] - 50} 156H${COL_X[4] + 50}`} stroke={LINE} strokeWidth="2" strokeLinecap="round" />
          <path
            d={`M${COL_X[0] - 50} 156H${markerX}`}
            stroke={BRAND}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={run > 0 ? 1 : 0}
          />
          {run > 0 && run < 1 ? <circle cx={markerX} cy={156} r={6} fill={BRAND} /> : null}

          {DISCIPLINES.map((discipline, r) => (
            <g key={discipline.label}>
              {/* Row label */}
              <rect x={560} y={ROW_Y[r] - 17} width={84} height={34} rx={17} fill={discipline.tint} stroke={discipline.color} strokeOpacity="0.45" />
              <Text x={602} y={ROW_Y[r] + 4.5} size={12} weight={700} fill={discipline.color}>
                {discipline.label}
              </Text>

              {COL_X.map((x, c) => {
                const done = marker > c + 0.35 + r * 0.18;
                const settle = easeOut(ramp(marker, c + 0.35 + r * 0.18, c + 0.6 + r * 0.18));
                return (
                  <g key={`${r}-${c}`}>
                    <rect
                      x={x - CELL.w / 2}
                      y={ROW_Y[r] - CELL.h / 2}
                      width={CELL.w}
                      height={CELL.h}
                      rx="9"
                      fill={done ? discipline.tint : "#FFFFFF"}
                      stroke={done ? discipline.color : LINE}
                      strokeOpacity={done ? 0.7 : 1}
                      strokeDasharray={done ? undefined : "4 4"}
                    />
                    <g opacity={0.25 + settle * 0.75}>
                      <CellGlyph row={r} x={x} y={ROW_Y[r]} color={done ? discipline.color : MUTED} />
                    </g>
                    {done ? (
                      <g transform={`translate(${x + CELL.w / 2 - 8} ${ROW_Y[r] - CELL.h / 2 + 8}) scale(${settle})`}>
                        <circle r="8" fill={OK} />
                        <path d="M-3.5 0l2.5 2.5 4.5-5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    ) : null}
                  </g>
                );
              })}
            </g>
          ))}

          <Text x={900} y={454} size={13} weight={600} fill={cellsDone === 15 ? OK : MUTED}>
            {`${cellsDone} / 15 deliverables`}
          </Text>

          {/* ---------------- 4. What it buys ---------------- */}
          {OUTCOMES.map((label, i) => {
            const on = easeOut(ramp(outcome, i * 0.2, i * 0.2 + 0.6));
            const w = 212;
            const x = 600 - (OUTCOMES.length * w + (OUTCOMES.length - 1) * 16) / 2 + i * (w + 16);
            return (
              <g key={label} opacity={0.3 + on * 0.7} transform={`translate(${x} ${512 + (1 - on) * 8})`}>
                <rect width={w} height="44" rx="22" fill={on > 0 ? "#FFF5ED" : "#FFFFFF"} stroke={on > 0 ? BRAND : LINE} strokeOpacity={on > 0 ? 0.6 : 1} />
                <circle cx="24" cy="22" r="9" fill={on > 0 ? BRAND : LINE} />
                <path d="M20 22l3 3 5-6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <Text x={42} y={27} size={15} weight={700} anchor="start" fill={on > 0 ? INK : MUTED}>
                  {label}
                </Text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default ProcessFilm;
