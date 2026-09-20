import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * A custom tool, drawn as the thing it actually is: a graph.
 *
 * Anyone who has built automation in this industry has stared at a node canvas
 * — Dynamo, Grasshopper, a visual pipeline of some sort. So the hero shows one
 * assembling itself: the inputs a project already has on the left, the tool we
 * write in the middle, the deliverables it produces on the right. The wires
 * draw themselves once on load, then data keeps running through them.
 *
 * All of it is SVG and CSS — the pulses are SMIL `animateMotion` riding the
 * same paths the wires are drawn from, so a moving dot can never drift off its
 * wire, and the whole thing costs no JavaScript and no image request.
 */

type Node = { id: string; label: string; sub: string; x: number; y: number };

const W = 132;
const H = 44;

const INPUTS: Node[] = [
  { id: "model", label: "Model", sub: "rvt · dwg", x: 0, y: 8 },
  { id: "data", label: "Project data", sub: "xls · csv", x: 0, y: 98 },
  { id: "rules", label: "Your standard", sub: "naming · QA", x: 0, y: 188 },
];

const OUTPUTS: Node[] = [
  { id: "sheets", label: "Sheet set", sub: "named · issued", x: 488, y: 8 },
  { id: "schedule", label: "Schedules", sub: "live · linked", x: 488, y: 98 },
  { id: "pack", label: "Issue pack", sub: "pdf · ifc", x: 488, y: 188 },
];

/** Wire paths, in draw order. Each id is what a pulse rides along. */
const WIRES: { id: string; d: string; len: number; delay: number }[] = [
  { id: "w-in-1", d: "M132 30 C 188 30, 198 120, 244 120", len: 160, delay: 240 },
  { id: "w-in-2", d: "M132 120 L 244 120", len: 112, delay: 340 },
  { id: "w-in-3", d: "M132 210 C 188 210, 198 120, 244 120", len: 160, delay: 440 },
  { id: "w-out-1", d: "M376 120 C 432 120, 442 30, 488 30", len: 160, delay: 620 },
  { id: "w-out-2", d: "M376 120 L 488 120", len: 112, delay: 720 },
  { id: "w-out-3", d: "M376 120 C 432 120, 442 210, 488 210", len: 160, delay: 820 },
];

function GraphNode({ node, index, tone }: { node: Node; index: number; tone: "in" | "out" }) {
  const accent = tone === "out";
  return (
    <g
      className="animate-fade-up"
      style={{ animationDelay: `${index * 90 + (accent ? 520 : 60)}ms` } as CSSProperties}
    >
      <rect
        x={node.x}
        y={node.y}
        width={W}
        height={H}
        rx="9"
        fill={accent ? "rgba(240,110,42,0.10)" : "rgba(255,255,255,0.045)"}
        stroke={accent ? "rgba(240,110,42,0.38)" : "rgba(255,255,255,0.14)"}
      />
      {/* The port the wire lands on. */}
      <circle
        cx={tone === "in" ? node.x + W : node.x}
        cy={node.y + H / 2}
        r="3.5"
        fill={accent ? "#F8A87A" : "rgba(255,255,255,0.45)"}
      />
      <text
        x={node.x + 14}
        y={node.y + 19}
        className="fill-white text-[12.5px] font-medium"
        style={{ fontFamily: "inherit" }}
      >
        {node.label}
      </text>
      <text x={node.x + 14} y={node.y + 33} className="fill-ink-400 text-[10px]">
        {node.sub}
      </text>
    </g>
  );
}

export function CustomToolGraph({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        // No panel, no chrome: the nodes sit straight on the hero, so the eye
        // reads one picture rather than a box inside a box.
        'relative',
        // Held still for anyone who has asked their system for less motion.
        'motion-reduce:[&_*]:!animate-none',
        className,
      )}
    >
      <svg
        viewBox="0 0 620 240"
        role="img"
        aria-label="A custom automation graph: project model, data and standards feed a tool that returns named sheets, schedules and an issue pack."
        className="block w-full"
      >
        <defs>
          <filter id="core-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="core-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F06E2A" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#F06E2A" stopOpacity="0.10" />
          </linearGradient>
        </defs>

        {/* Wires, drawn once as the graph assembles. */}
        <g fill="none" strokeWidth="1.5" strokeLinecap="round">
          {WIRES.map((wire) => (
            <path
              key={wire.id}
              id={wire.id}
              d={wire.d}
              stroke="rgba(240,110,42,0.32)"
              strokeDasharray={wire.len}
              className="animate-draw"
              style={
                {
                  "--draw-length": wire.len,
                  animationDelay: `${wire.delay}ms`,
                } as CSSProperties
              }
            />
          ))}
        </g>

        {/* Data running through, for as long as anyone is looking. */}
        <g>
          {WIRES.map((wire, index) => (
            <circle key={`${wire.id}-pulse`} r="3.2" fill="#F8A87A" opacity="0.95">
              <animateMotion
                dur="2.6s"
                begin={`${1.4 + index * 0.18}s`}
                repeatCount="indefinite"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="spline"
                keySplines="0.45 0 0.55 1"
              >
                <mpath href={`#${wire.id}`} xlinkHref={`#${wire.id}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.95;0.95;0"
                keyTimes="0;0.12;0.85;1"
                dur="2.6s"
                begin={`${1.4 + index * 0.18}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {INPUTS.map((node, index) => (
          <GraphNode key={node.id} node={node} index={index} tone="in" />
        ))}
        {OUTPUTS.map((node, index) => (
          <GraphNode key={node.id} node={node} index={index} tone="out" />
        ))}

        {/* The tool itself — the only part of the picture that is ours. */}
        <g className="animate-fade-up" style={{ animationDelay: "300ms" } as CSSProperties}>
          <rect
            x="244"
            y="74"
            width="132"
            height="92"
            rx="14"
            fill="url(#core-fill)"
            stroke="rgba(240,110,42,0.55)"
            strokeWidth="1.5"
            filter="url(#core-glow)"
          />
          <circle cx="244" cy="120" r="3.5" fill="#F8A87A" />
          <circle cx="376" cy="120" r="3.5" fill="#F8A87A" />
          {/* A processor die: the one shape that says "we wrote this". */}
          <g stroke="#F8A87A" strokeWidth="1.4" fill="none" opacity="0.95">
            <rect x="292" y="88" width="36" height="36" rx="6" />
            <rect x="302" y="98" width="16" height="16" rx="3" fill="rgba(248,168,122,0.35)" />
            <path d="M300 88v-7M310 88v-7M320 88v-7M300 124v7M310 124v7M320 124v7" />
            <path d="M292 96h-7M292 106h-7M292 116h-7M328 96h7M328 106h7M328 116h7" />
          </g>
          <text x="310" y="142" textAnchor="middle" className="fill-white text-[12.5px] font-semibold">
            Your tool
          </text>
          <text x="310" y="155" textAnchor="middle" className="fill-brand-300 text-[9.5px]">
            written for you
          </text>
        </g>

      </svg>

    </div>
  );
}

export default CustomToolGraph;
