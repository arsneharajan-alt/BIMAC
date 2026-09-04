import { cn } from "@/lib/utils";

/**
 * A grid of connected dots, drifting slowly.
 *
 * Pure backdrop: `aria-hidden`, `pointer-events-none`, and pitched low enough
 * that it registers as texture rather than content.
 *
 * Drawn as a tiled SVG pattern rather than thousands of elements, so the whole
 * layer costs one `<rect>`. The drift translates by exactly one tile, which is
 * what makes the loop seamless — land anywhere in the cycle and the grid is
 * indistinguishable from where it started.
 */

const TILE = 44;

export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 select-none overflow-hidden", className)}
    >
      {/* Oversized so the drift never exposes an edge. */}
      <div className="absolute -inset-x-16 -inset-y-16 animate-grid-drift">
        <svg className="h-full w-full" focusable="false">
          <defs>
            <pattern
              id="dot-grid"
              width={TILE}
              height={TILE}
              patternUnits="userSpaceOnUse"
            >
              {/* The connections, then the node they meet at. */}
              <path
                d={`M0 0H${TILE}M0 0V${TILE}`}
                stroke="#FFFFFF"
                strokeWidth="0.5"
                strokeOpacity="0.22"
                fill="none"
              />
              <circle cx="0" cy="0" r="1.4" fill="#FFFFFF" fillOpacity="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
      </div>

      {/*
        Two more passes of motion over the drift, so the field reads as alive
        rather than as a texture that happens to slide: a breath that swells
        from the centre, and a band of light crossing left to right.
      */}
      <div className="absolute inset-0 animate-grid-breathe bg-[radial-gradient(circle_at_62%_45%,rgba(147,205,253,0.13),transparent_60%)]" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-y-0 -left-1/3 w-2/5 animate-grid-scan bg-[linear-gradient(90deg,transparent,rgba(147,205,253,0.1),rgba(239,247,255,0.16),rgba(147,205,253,0.1),transparent)] blur-2xl" />
      </div>
    </div>
  );
}

export default DotGrid;
