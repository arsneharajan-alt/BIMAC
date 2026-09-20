import type { ReactNode } from "react";
import { BRAND, BRAND_DEEP, FAINT, Frame, LINE, STEEL, d } from "./scene-kit";

/**
 * A drawing of its own for each of the twenty architecture products.
 *
 * A card with a glyph on it tells a visitor nothing, and twenty cards sharing
 * one discipline picture tells them less. Each scene here plays what its tool
 * actually does, on the same nine-second clock and in the same conventions as
 * every other scene on the site (see `scene-kit`): double-line walls and door
 * swings, ceiling grids, framing at centres, poché on a cut.
 *
 * No words anywhere in the artwork — the card's own title is the only text.
 *
 * Card 1, CAD-to-Revit, is drawn in `ToolScene` because it belongs to every
 * discipline rather than to architecture alone.
 */

/* ------------------------------------------------------------------ */
/* Shared geometry                                                     */
/*                                                                     */
/* The residential floor plate the plan-based scenes are drawn on: one  */
/* corridor, three flats either side, core in the middle. Drawing them  */
/* from one set of numbers means the plate a visitor met on Unit        */
/* Planning is recognisably the same plate under Design Development.    */
/* ------------------------------------------------------------------ */

const PLATE = { x: 30, y: 34, w: 260, h: 92 };
/** The corridor band, and the core sitting inside it. */
const CORR = { y: 72, h: 16 };
const CORE = { x: 138, y: 72, w: 44, h: 16 };

type Rect = { x: number; y: number; w: number; h: number };

/** Six flats — three above the corridor, three below. */
const UNITS: Rect[] = [
  { x: 30, y: 34, w: 86, h: 38 },
  { x: 116, y: 34, w: 87, h: 38 },
  { x: 203, y: 34, w: 87, h: 38 },
  { x: 30, y: 88, w: 86, h: 38 },
  { x: 116, y: 88, w: 87, h: 38 },
  { x: 203, y: 88, w: 87, h: 38 },
];

const R = (r: Rect) => `M${r.x} ${r.y}h${r.w}v${r.h}h${-r.w}z`;

/** The plate outline and corridor, drawn faint under whatever a scene adds. */
function PlanBase() {
  return (
    <g fill="none" stroke={FAINT} strokeWidth="0.8">
      <path d={R(PLATE)} stroke={LINE} strokeWidth="1.1" fill="rgba(255,255,255,0.03)" />
      <path d={`M${PLATE.x} ${CORR.y}h${PLATE.w}M${PLATE.x} ${CORR.y + CORR.h}h${PLATE.w}`} />
      {UNITS.map((u) => (
        <path key={`${u.x}-${u.y}`} d={R(u)} />
      ))}
    </g>
  );
}

/** A tag: two rules on a chip. No letters — the shape is the tag. */
function Tag({ x, y, delay, w = 22 }: { x: number; y: number; delay: number; w?: number }) {
  return (
    <g
      className="animate-scene-pop"
      style={{ ...d(delay), transformBox: "fill-box", transformOrigin: "center" }}
    >
      <rect x={x} y={y} width={w} height={11} rx="2" fill="rgba(251,124,60,0.9)" />
      <path
        d={`M${x + 4} ${y + 4}h${w - 8}M${x + 4} ${y + 7.5}h${w - 12}`}
        stroke="#fff"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </g>
  );
}

/** A dimension string: witness lines, arrow ticks, the run between them. */
function Dim({
  x1,
  x2,
  y,
  delay,
  drop = 6,
}: {
  x1: number;
  x2: number;
  y: number;
  delay: number;
  drop?: number;
}) {
  return (
    <g className="animate-scene-in" style={d(delay)} stroke={BRAND} strokeWidth="0.8" fill="none">
      <path d={`M${x1} ${y - drop}V${y + drop}M${x2} ${y - drop}V${y + drop}`} />
      <path d={`M${x1} ${y}H${x2}`} />
      <path
        d={`M${x1 + 3} ${y - 2.2}l-3 2.2 3 2.2M${x2 - 3} ${y - 2.2}l3 2.2-3 2.2`}
        strokeLinejoin="round"
      />
    </g>
  );
}

/** A sheet with its title block — the unit the drawing scenes are drawn on. */
function Sheet({
  x,
  y,
  w,
  h,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: ReactNode;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="rgba(255,255,255,0.06)" stroke={LINE} strokeWidth="0.9" />
      <rect
        x={x + 2}
        y={y + 2}
        width={w - 4}
        height={h - 4}
        fill="none"
        stroke="rgba(147,205,253,0.25)"
        strokeWidth="0.5"
      />
      {/* Title block, bottom right, where it always is. */}
      <rect
        x={x + w - 26}
        y={y + h - 14}
        width="24"
        height="12"
        fill="rgba(251,124,60,0.28)"
        stroke={BRAND}
        strokeWidth="0.6"
      />
      {children}
    </g>
  );
}

/** The north point, the one piece of furniture a site drawing never omits. */
function North({ x = 296, y = 28 }: { x?: number; y?: number }) {
  return (
    <g stroke="rgba(147,205,253,0.45)" strokeWidth="0.8" fill="none">
      <circle cx={x} cy={y} r="7" />
      <path d={`M${x} ${y - 6}v13`} />
      <path d={`M${x} ${y - 8}l3.4 5.6h-6.8z`} fill="rgba(147,205,253,0.65)" stroke="none" />
    </g>
  );
}

/* ================================================================== */
/* 2. Site & Feasibility — the constraints close in on what is left    */
/* ================================================================== */

const BOUNDARY = "M46 118L66 42L242 34L288 114Z";
/** The same plot pulled in by the setbacks. */
const ENVELOPE = "M64 110L80 56L228 49L266 106Z";
/** The easement through it, which no scheme is allowed to cross. */
const EASEMENT = "M196 40L216 39L244 112L224 113Z";

function SiteFeasibility() {
  return (
    <Frame label="A site survey with setbacks, an easement and access closing in on the buildable envelope">
      {/* The road the site is served off. */}
      <path d="M18 126h284" stroke="rgba(147,205,253,0.22)" strokeWidth="5" />
      <path d="M18 126h284" stroke="rgba(147,205,253,0.4)" strokeWidth="0.7" strokeDasharray="8 7" />
      <North />

      {/* Survey: the boundary, pinned at its corners. */}
      <g className="animate-scene-in">
        <path d={BOUNDARY} fill="rgba(255,255,255,0.035)" stroke={LINE} strokeWidth="1.1" strokeDasharray="6 4" />
        <g fill={LINE}>
          <circle cx="46" cy="118" r="2" />
          <circle cx="66" cy="42" r="2" />
          <circle cx="242" cy="34" r="2" />
          <circle cx="288" cy="114" r="2" />
        </g>
      </g>

      {/* Levels — the ground the scheme actually has to sit on. */}
      <g className="animate-scene-in" style={d(350)} fill="none" stroke="rgba(94,211,190,0.4)" strokeWidth="0.7">
        <path d="M60 104q56-22 108-6t94-4" />
        <path d="M64 88q54-24 106-8t92-6" />
        <path d="M70 70q50-24 100-10t88-8" />
      </g>

      {/* Setback: the boundary offset in, the first thing off the plot. */}
      <g className="animate-scene-in" style={d(1000)}>
        <path d={ENVELOPE} fill="none" stroke={BRAND} strokeWidth="1" strokeDasharray="4 3" />
      </g>
      <Dim x1={46} x2={64} y={122} delay={1250} drop={4} />

      {/* The easement, hatched the way a no-build zone is hatched. */}
      <g className="animate-scene-in" style={d(1550)}>
        <path d={EASEMENT} fill="url(#cad-hatch)" stroke={BRAND_DEEP} strokeWidth="0.9" strokeDasharray="5 3" />
      </g>

      {/* Access off the road, and the servicing point it has to reach. */}
      <g className="animate-scene-in" style={d(1900)} stroke={STEEL} strokeWidth="1.4" fill="none">
        <path d="M110 126V104" />
        <path d="M110 98l4.4 8h-8.8z" fill={STEEL} stroke="none" />
        <circle cx="110" cy="96" r="4" strokeDasharray="2 2" />
      </g>

      {/* What is left: the buildable envelope, with the easement cut out. */}
      <g className="animate-scene-in" style={d(2400)}>
        <path
          d={ENVELOPE + " " + EASEMENT}
          fillRule="evenodd"
          fill="rgba(251,124,60,0.22)"
          stroke={BRAND}
          strokeWidth="1.4"
        />
      </g>
    </Frame>
  );
}

/* ================================================================== */
/* 5. Unit Planning — the mix lands on the plate, corridor first       */
/* ================================================================== */

function UnitPlanning() {
  return (
    <Frame label="A floor plate taking a unit mix: corridor, core and six flats generated off it">
      {/* The empty plot, before anything is on it. */}
      <path d="M20 130h280" stroke="rgba(147,205,253,0.22)" strokeWidth="4" />
      <rect x="22" y="26" width="276" height="104" fill="none" stroke={FAINT} strokeWidth="0.9" strokeDasharray="6 4" />

      {/* The plate. */}
      <g className="animate-scene-in" style={d(200)}>
        <rect
          x={PLATE.x}
          y={PLATE.y}
          width={PLATE.w}
          height={PLATE.h}
          fill="rgba(255,255,255,0.04)"
          stroke={LINE}
          strokeWidth="1.4"
        />
      </g>

      {/* The corridor, struck through first — everything hangs off it. */}
      <g className="animate-scene-in" style={d(700)}>
        <rect
          x={PLATE.x}
          y={CORR.y}
          width={PLATE.w}
          height={CORR.h}
          fill="rgba(147,205,253,0.1)"
          stroke={LINE}
          strokeWidth="0.9"
        />
      </g>

      {/* The core, in the middle of the corridor where it belongs. */}
      <g className="animate-scene-in" style={d(950)}>
        <rect
          x={CORE.x}
          y={CORE.y}
          width={CORE.w}
          height={CORE.h}
          fill="url(#cad-hatch)"
          stroke={LINE}
          strokeWidth="0.9"
        />
      </g>

      {/* Six flats, coming off the corridor one at a time. */}
      {UNITS.map((u, index) => (
        <g key={`${u.x}-${u.y}`} className="animate-scene-in" style={d(1250 + index * 240)}>
          <rect x={u.x} y={u.y} width={u.w} height={u.h} fill="rgba(251,124,60,0.14)" stroke={BRAND} strokeWidth="1" />
          {/* Entrance door off the corridor, with its swing. */}
          {index < 3 ? (
            <g stroke={BRAND} strokeWidth="0.9" fill="none">
              <path d={`M${u.x + 22} ${u.y + u.h}v-11`} />
              <path d={`M${u.x + 22} ${u.y + u.h - 11}A11 11 0 0 0 ${u.x + 11} ${u.y + u.h}`} strokeDasharray="2 2" />
            </g>
          ) : (
            <g stroke={BRAND} strokeWidth="0.9" fill="none">
              <path d={`M${u.x + 22} ${u.y}v11`} />
              <path d={`M${u.x + 22} ${u.y + 11}A11 11 0 0 1 ${u.x + 11} ${u.y}`} strokeDasharray="2 2" />
            </g>
          )}
          {/* Windows in the outside wall — a plan is not a plan without them. */}
          <path
            d={
              index < 3
                ? `M${u.x + 20} ${u.y}h${u.w - 40}M${u.x + 20} ${u.y + 2}h${u.w - 40}`
                : `M${u.x + 20} ${u.y + u.h}h${u.w - 40}M${u.x + 20} ${u.y + u.h - 2}h${u.w - 40}`
            }
            stroke="rgba(147,205,253,0.85)"
            strokeWidth="0.9"
          />
        </g>
      ))}

      {/* The mix set out — target area against what the plate gives back. */}
      <Dim x1={PLATE.x} x2={PLATE.x + 86} y={131} delay={3000} drop={4} />
      <Dim x1={PLATE.x + 86} x2={PLATE.x + 173} y={131} delay={3200} drop={4} />
      <Dim x1={PLATE.x + 173} x2={PLATE.x + PLATE.w} y={131} delay={3400} drop={4} />
    </Frame>
  );
}

/* ================================================================== */
/* 9. Design Development — the inside of every flat gets laid out      */
/* ================================================================== */

function DesignDevelopment() {
  /** One flat's rooms, as fractions of the unit box. */
  const layout: { fx: number; fy: number; fw: number; fh: number; tone: string }[] = [
    { fx: 0.02, fy: 0.04, fw: 0.44, fh: 0.58, tone: "rgba(251,124,60,0.28)" },
    { fx: 0.48, fy: 0.04, fw: 0.3, fh: 0.32, tone: "rgba(94,211,190,0.3)" },
    { fx: 0.48, fy: 0.38, fw: 0.3, fh: 0.24, tone: "rgba(147,205,253,0.24)" },
    { fx: 0.8, fy: 0.04, fw: 0.18, fh: 0.58, tone: "rgba(147,205,253,0.14)" },
    { fx: 0.02, fy: 0.64, fw: 0.96, fh: 0.32, tone: "rgba(251,124,60,0.12)" },
  ];

  return (
    <Frame label="Each flat on the floor plate laid out inside with living, kitchen, bedroom and bathroom">
      <PlanBase />
      <rect x={CORE.x} y={CORE.y} width={CORE.w} height={CORE.h} fill="url(#cad-hatch)" stroke={FAINT} strokeWidth="0.7" />

      {UNITS.map((u, unitIndex) => (
        <g key={`${u.x}-${u.y}`}>
          {layout.map((room, roomIndex) => {
            const x = u.x + room.fx * u.w;
            const y = u.y + room.fy * u.h;
            const w = room.fw * u.w;
            const h = room.fh * u.h;
            return (
              <g
                key={`${unitIndex}-${roomIndex}`}
                className="animate-scene-in"
                style={d(400 + unitIndex * 330 + roomIndex * 70)}
              >
                <rect x={x} y={y} width={w} height={h} fill={room.tone} stroke={BRAND} strokeWidth="0.6" />
                {/* A fitting or two, so a room reads as that room. */}
                {roomIndex === 1 && (
                  <path
                    d={`M${x + 2} ${y + h - 4}h${w - 4}M${x + w - 6} ${y + 2}v${h - 4}`}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="0.8"
                  />
                )}
                {roomIndex === 0 && (
                  <rect x={x + 3} y={y + h - 9} width={w - 6} height="6" rx="1.5" fill="rgba(255,255,255,0.22)" />
                )}
                {roomIndex === 3 && <circle cx={x + w / 2} cy={y + h / 2} r="2.6" fill="rgba(255,255,255,0.35)" />}
              </g>
            );
          })}
        </g>
      ))}
    </Frame>
  );
}

/* ================================================================== */
/* 6. Schedule Automation — elements counted into sorted rows          */
/* ================================================================== */

function ScheduleAutomation() {
  const rows = Array.from({ length: 6 });

  return (
    <Frame label="Elements counted off a plan and landing as sorted rows in a Revit schedule">
      {/* The plan the count is taken off. */}
      <rect x="20" y="36" width="104" height="88" fill="rgba(255,255,255,0.03)" stroke={LINE} strokeWidth="1.1" />
      {[0, 1, 2].map((row) =>
        [0, 1].map((col) => (
          <g key={`${row}-${col}`} className="animate-scene-in" style={d(400 + (row * 2 + col) * 300)}>
            <rect
              x={30 + col * 46}
              y={46 + row * 28}
              width="38"
              height="20"
              fill="rgba(251,124,60,0.22)"
              stroke={BRAND}
              strokeWidth="0.8"
            />
            <circle cx={49 + col * 46} cy={56 + row * 28} r="2" fill={BRAND} />
          </g>
        )),
      )}

      {/* The schedule, taking one row per element as it is counted. */}
      <rect x="142" y="36" width="156" height="88" rx="4" fill="rgba(7,23,38,0.68)" stroke={FAINT} />
      <rect x="142" y="36" width="156" height="13" rx="4" fill="rgba(147,205,253,0.16)" />
      <path d="M190 36v88M240 36v88" stroke="rgba(147,205,253,0.16)" strokeWidth="0.7" />

      {rows.map((_, i) => (
        <g key={i} className="animate-scene-in" style={d(600 + i * 300)}>
          <rect x="150" y={56 + i * 11} width="30" height="4.5" rx="2.2" fill="rgba(147,205,253,0.45)" />
          <rect x="198" y={56 + i * 11} width="34" height="4.5" rx="2.2" fill={BRAND} />
          <rect x="248" y={56 + i * 11} width={20 + (i % 3) * 8} height="4.5" rx="2.2" fill="rgba(94,211,190,0.7)" />
        </g>
      ))}

      {/* The total, which is the only number anybody reads. */}
      <g className="animate-scene-in" style={d(2600)}>
        <path d="M150 122h140" stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" />
        <rect
          x="248"
          y="114"
          width="42"
          height="5"
          rx="2.5"
          fill={BRAND_DEEP}
          className="origin-left animate-scene-bar"
          style={{ ...d(2700), transformBox: "fill-box" }}
        />
      </g>
    </Frame>
  );
}

/* ================================================================== */
/* 7. Parking & Mobility — bays land on the grid, aisle by aisle       */
/* ================================================================== */

function ParkingMobility() {
  /** Two banks of bays either side of one aisle, plus the end row. */
  const BAY_W = 13;
  const banks = [
    { y: 34, h: 26, count: 18, x0: 24, delay: 500 },
    { y: 86, h: 26, count: 18, x0: 24, delay: 1100 },
  ];

  return (
    <Frame label="Parking bays laid out to the code against a structural grid, with the aisle and ramp resolved">
      {/* The basement plate and the grid the bays have to land on. */}
      <rect x="20" y="30" width="280" height="96" fill="rgba(255,255,255,0.03)" stroke={LINE} strokeWidth="1.1" />
      <g stroke="rgba(147,205,253,0.22)" strokeWidth="0.7" strokeDasharray="7 3 1.5 3">
        {[62, 140, 218, 284].map((x) => (
          <path key={x} d={`M${x} 24v108`} />
        ))}
      </g>
      {/* Columns, which is what makes a layout hard. */}
      <g fill="url(#cad-hatch)" stroke={LINE} strokeWidth="0.7">
        {[62, 140, 218].map((x) => (
          <g key={x}>
            <rect x={x - 4} y="56" width="8" height="8" />
            <rect x={x - 4} y="82" width="8" height="8" />
          </g>
        ))}
      </g>

      {/* The aisle, set out to its width before a single bay is drawn. */}
      <g className="animate-scene-in" style={d(200)}>
        <rect x="20" y="60" width="280" height="26" fill="rgba(147,205,253,0.09)" stroke={FAINT} strokeWidth="0.7" />
        <path d="M26 73h268" stroke="rgba(147,205,253,0.4)" strokeWidth="0.7" strokeDasharray="9 6" />
      </g>

      {/* Bays, filling along each bank. */}
      {banks.map((bank) =>
        Array.from({ length: bank.count }).map((_, i) => {
          const x = bank.x0 + i * BAY_W;
          // A column eats a bay wherever it lands; those come back accessible.
          const accessible = i === 3 || i === 14;
          return (
            <g key={`${bank.y}-${i}`} className="animate-scene-in" style={d(bank.delay + i * 110)}>
              <rect
                x={x}
                y={bank.y}
                width={BAY_W - 1}
                height={bank.h}
                fill={accessible ? "rgba(94,211,190,0.28)" : "rgba(251,124,60,0.16)"}
                stroke={accessible ? STEEL : BRAND}
                strokeWidth="0.7"
              />
              {accessible && (
                <circle cx={x + (BAY_W - 1) / 2} cy={bank.y + bank.h / 2} r="3" fill="none" stroke={STEEL} strokeWidth="1" />
              )}
            </g>
          );
        }),
      )}

      {/* The ramp in, and the one-way route round the aisle. */}
      <g className="animate-scene-in" style={d(2600)} stroke={BRAND_DEEP} strokeWidth="1.2" fill="none">
        <path d="M292 73h-14" />
        <path d="M272 73l9 4.5v-9z" fill={BRAND_DEEP} stroke="none" />
      </g>
      <circle r="2.6" fill="#fff">
        <animateMotion dur="9s" repeatCount="indefinite" path="M290 73H30" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.8;0.92" dur="9s" repeatCount="indefinite" />
      </circle>

      {/* The bay module, set out. */}
      <Dim x1={24} x2={24 + BAY_W} y={131} delay={3200} drop={4} />
    </Frame>
  );
}

/* ================================================================== */
/* 8. Ramp & Staircase — the flight builds, then the ramp beside it    */
/* ================================================================== */

function RampStaircase() {
  const treads = 9;
  const rise = 7;
  const going = 13;
  const x0 = 34;
  const y0 = 120;

  const railPath = `M${x0 - 4} ${y0 - 24}L${x0 + treads * going} ${y0 - treads * rise - 24}`;

  return (
    <Frame label="A stair flight building tread by tread with its handrail, and a ramp generated beside it">
      {/* Landings, top and bottom. */}
      <path d={`M18 ${y0}h${x0 - 18}v6H18z`} fill="rgba(147,205,253,0.12)" stroke={LINE} strokeWidth="0.8" />
      <path
        d={`M${x0 + treads * going} ${y0 - treads * rise}h34v6h-34z`}
        fill="rgba(147,205,253,0.12)"
        stroke={LINE}
        strokeWidth="0.8"
      />

      {/* The stringer the flight is carried on. */}
      <path
        d={`M${x0} ${y0 + 6}L${x0 + treads * going} ${y0 - treads * rise + 6}L${x0 + treads * going} ${y0 - treads * rise + 12}L${x0} ${y0 + 12}Z`}
        fill="rgba(251,124,60,0.16)"
        stroke={BRAND}
        strokeWidth="0.9"
        className="animate-scene-in"
        style={d(200)}
      />

      {/* Treads and risers, one step at a time. */}
      {Array.from({ length: treads }).map((_, i) => {
        const x = x0 + i * going;
        const y = y0 - i * rise;
        return (
          <g key={i} className="animate-scene-in" style={d(500 + i * 170)}>
            <path d={`M${x} ${y}h${going}`} stroke={BRAND} strokeWidth="1.6" strokeLinecap="round" />
            <path d={`M${x + going} ${y}v${-rise}`} stroke="rgba(251,124,60,0.6)" strokeWidth="1" />
          </g>
        );
      })}

      {/* The handrail, drawn in one pass once the flight exists. */}
      <path
        d={railPath}
        fill="none"
        stroke={STEEL}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="200"
        strokeDashoffset="200"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="200;200;0;0"
          keyTimes="0;0.3;0.52;1"
          dur="9s"
          repeatCount="indefinite"
        />
      </path>

      {/* And the ramp: one gradient, its landings, and the same rail. */}
      <g className="animate-scene-in" style={d(4200)}>
        <path
          d="M174 122h34v6h-34zM278 76h26v6h-26z"
          fill="rgba(147,205,253,0.12)"
          stroke={LINE}
          strokeWidth="0.8"
        />
        <path
          d="M208 122L278 82L278 88L208 128Z"
          fill="rgba(251,124,60,0.16)"
          stroke={BRAND}
          strokeWidth="0.9"
        />
        <path d="M208 122L278 82" stroke={BRAND} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M204 98L274 58" stroke={STEEL} strokeWidth="2.2" strokeLinecap="round" />
        {/* The gradient, which is the only number a ramp is judged on. */}
        <path d="M208 122h70" stroke="rgba(251,124,60,0.45)" strokeWidth="0.7" strokeDasharray="4 3" />
        <path d="M278 122V82" stroke="rgba(251,124,60,0.45)" strokeWidth="0.7" strokeDasharray="4 3" />
      </g>

      {/* Going and rise, set out. */}
      <Dim x1={x0} x2={x0 + going} y={132} delay={5600} drop={4} />
    </Frame>
  );
}

/* ================================================================== */
/* 10. Ceiling Generation — grid from the centre, then the elements    */
/* ================================================================== */

function CeilingGeneration() {
  const lights = [72, 120, 168, 216, 264].flatMap((x) => [
    { x, y: 54, delay: 700 },
    { x, y: 102, delay: 900 },
  ]);

  return (
    <Frame label="A ceiling grid set out from the centre of a room, then lights, diffusers and sprinklers placed on it">
      <rect x="40" y="30" width="240" height="96" fill="rgba(255,255,255,0.03)" stroke={LINE} strokeWidth="1.2" />

      {/* Setting-out lines: the grid starts here, not at a wall. */}
      <g className="animate-scene-in" style={d(150)} stroke={BRAND_DEEP} strokeWidth="0.8" strokeDasharray="7 3 1.5 3">
        <path d="M160 24v108" />
        <path d="M32 78h256" />
      </g>

      {/* The grid, running out from the centre in both directions. */}
      {Array.from({ length: 9 }).map((_, i) => {
        const offset = (i + 1) * 16;
        return (
          <g key={`v${i}`} className="animate-scene-in" style={d(350 + i * 70)} stroke={LINE} strokeWidth="0.7">
            <path d={`M${160 - offset} 30v96`} />
            <path d={`M${160 + offset} 30v96`} />
          </g>
        );
      })}
      {Array.from({ length: 3 }).map((_, i) => {
        const offset = (i + 1) * 16;
        return (
          <g key={`h${i}`} className="animate-scene-in" style={d(400 + i * 100)} stroke={LINE} strokeWidth="0.7">
            <path d={`M40 ${78 - offset}h240`} />
            <path d={`M40 ${78 + offset}h240`} />
          </g>
        );
      })}

      {/* Cut tiles at the perimeter, which is where a ceiling is judged. */}
      <g className="animate-scene-in" style={d(1300)}>
        <rect x="40" y="30" width="8" height="96" fill="rgba(251,124,60,0.28)" stroke={BRAND} strokeWidth="0.7" />
        <rect x="272" y="30" width="8" height="96" fill="rgba(251,124,60,0.28)" stroke={BRAND} strokeWidth="0.7" />
      </g>

      {/* Linear luminaires, on the grid and on centres. */}
      {lights.map((light, index) => (
        <g
          key={`${light.x}-${light.y}`}
          className="animate-scene-pop"
          style={{ ...d(1600 + index * 90), transformBox: "fill-box", transformOrigin: "center" }}
        >
          <rect x={light.x - 15} y={light.y - 3} width="30" height="6" rx="1" fill="rgba(251,124,60,0.85)" />
          <rect x={light.x - 15} y={light.y - 3} width="30" height="6" rx="1" fill="none" stroke="#fff" strokeWidth="0.5" />
        </g>
      ))}

      {/* Supply diffusers, in the squares a diffuser goes in. */}
      {[96, 192].map((x, index) => (
        <g
          key={`sd${x}`}
          className="animate-scene-pop"
          style={{ ...d(2700 + index * 200), transformBox: "fill-box", transformOrigin: "center" }}
        >
          <rect x={x - 8} y="70" width="16" height="16" fill="rgba(94,211,190,0.3)" stroke={STEEL} strokeWidth="0.9" />
          <path d={`M${x - 8} 70l16 16M${x + 8} 70l-16 16`} stroke={STEEL} strokeWidth="0.7" />
        </g>
      ))}

      {/* Sprinklers and detectors — small, and on their own centres. */}
      {[64, 128, 192, 256].map((x, index) => (
        <g
          key={`sp${x}`}
          className="animate-scene-pop"
          style={{ ...d(3100 + index * 160), transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx={x} cy="78" r="3.2" fill="none" stroke="#fff" strokeWidth="1.1" />
          <circle cx={x} cy="78" r="1" fill="#fff" />
        </g>
      ))}

      <Dim x1={72} x2={120} y={132} delay={3900} drop={4} />
    </Frame>
  );
}

/* ================================================================== */
/* 11. Detailed Design — one rule, applied everywhere it belongs       */
/* ================================================================== */

function DetailedDesign() {
  return (
    <Frame label="Door, window, curtain wall and finish rules applied by type across a whole plan">
      {/* The plan the rules are applied to. */}
      <rect x="20" y="34" width="168" height="92" fill="rgba(255,255,255,0.03)" stroke={LINE} strokeWidth="1.1" />
      <g stroke={LINE} strokeWidth="0.9" fill="none">
        <path d="M104 34v92M20 80h84M104 62h84" />
      </g>

      {/* Doors, with their swings, stamped in by type. */}
      {[
        { x: 60, y: 80, flip: false, delay: 500 },
        { x: 148, y: 62, flip: true, delay: 750 },
        { x: 60, y: 34, flip: false, delay: 1000 },
      ].map((door) => (
        <g key={`${door.x}-${door.y}`} className="animate-scene-in" style={d(door.delay)} stroke={BRAND} strokeWidth="1" fill="none">
          <path d={`M${door.x} ${door.y}v${door.flip ? -14 : 14}`} />
          <path
            d={`M${door.x} ${door.y + (door.flip ? -14 : 14)}A14 14 0 0 ${door.flip ? 1 : 0} ${door.x - 14} ${door.y}`}
            strokeDasharray="2 2"
          />
        </g>
      ))}

      {/* Windows, doubled up the way a plan draws them. */}
      {[
        { x: 28, y: 126, w: 46, delay: 1250 },
        { x: 116, y: 126, w: 56, delay: 1450 },
      ].map((win) => (
        <g key={win.x} className="animate-scene-in" style={d(win.delay)}>
          <path
            d={`M${win.x} ${win.y}h${win.w}M${win.x} ${win.y - 2.5}h${win.w}`}
            stroke="rgba(147,205,253,0.9)"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* Joinery and wet areas, applied per room from the schedule. */}
      <g className="animate-scene-in" style={d(1700)}>
        <rect x="26" y="40" width="54" height="10" fill="rgba(251,124,60,0.4)" stroke={BRAND} strokeWidth="0.6" />
        <rect x="112" y="92" width="26" height="14" rx="2" fill="rgba(94,211,190,0.32)" stroke={STEEL} strokeWidth="0.7" />
        <circle cx="156" cy="99" r="5" fill="rgba(94,211,190,0.32)" stroke={STEEL} strokeWidth="0.7" />
      </g>

      {/* And the curtain wall, gridded out on the elevation beside it. */}
      <rect x="202" y="34" width="96" height="92" rx="3" fill="rgba(7,23,38,0.6)" stroke={FAINT} />
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => {
          const spandrel = row === 0 || row === 3;
          return (
            <rect
              key={`${row}-${col}`}
              x={212 + col * 19}
              y={44 + row * 18}
              width="18"
              height="17"
              fill={spandrel ? "rgba(251,124,60,0.34)" : "rgba(147,205,253,0.16)"}
              stroke="rgba(147,205,253,0.3)"
              strokeWidth="0.5"
              className="animate-scene-in"
              style={d(2100 + row * 190 + col * 60)}
            />
          );
        }),
      )}
      {Array.from({ length: 5 }).map((_, i) => (
        <rect
          key={`m${i}`}
          x={211 + i * 19}
          y="44"
          width="2.2"
          height="72"
          fill={BRAND}
          className="animate-scene-in"
          style={d(1900 + i * 70)}
        />
      ))}
    </Frame>
  );
}

/* ================================================================== */
/* 12. Parameter Automation — the sheet writes the model, links too    */
/* ================================================================== */

function ParameterAutomation() {
  const rows = [0, 1, 2, 3, 4];

  return (
    <Frame label="Parameter values written from a spreadsheet into a host model and into its linked models">
      {/* The sheet. Column rules and a header band, no words. */}
      <rect x="20" y="34" width="126" height="92" rx="4" fill="rgba(7,23,38,0.7)" stroke={FAINT} />
      <rect x="20" y="34" width="126" height="14" rx="4" fill="rgba(94,211,190,0.18)" />
      <path d="M60 34v92M100 34v92" stroke="rgba(147,205,253,0.18)" strokeWidth="0.7" />
      {rows.map((row) => (
        <g key={row}>
          <path d={`M20 ${62 + row * 15}h126`} stroke="rgba(147,205,253,0.12)" strokeWidth="0.7" />
          <g className="animate-scene-in" style={d(500 + row * 380)}>
            <rect x="26" y={52 + row * 15} width="26" height="5" rx="2.5" fill="rgba(147,205,253,0.45)" />
            <rect x="66" y={52 + row * 15} width="28" height="5" rx="2.5" fill={BRAND} />
            <rect x="106" y={52 + row * 15} width="32" height="5" rx="2.5" fill="rgba(94,211,190,0.7)" />
          </g>
        </g>
      ))}
      {/* The cell cursor, walking down the column as the rows fill. */}
      <rect x="64" y="50" width="32" height="9" fill="none" stroke="#fff" strokeWidth="1.2">
        <animate
          attributeName="y"
          values="50;65;80;95;110;110"
          keyTimes="0;0.16;0.32;0.48;0.64;1"
          dur="9s"
          repeatCount="indefinite"
          calcMode="discrete"
        />
      </rect>

      {/* The write, into the host and then into each link. */}
      <g stroke={BRAND} strokeWidth="1.2" fill="none">
        <path d="M152 80h12" />
        <path d="M170 80l-8 4.5v-9z" fill={BRAND} stroke="none" />
      </g>

      {/* Host model. */}
      <g className="animate-scene-in" style={d(700)}>
        <rect x="182" y="38" width="112" height="36" rx="3" fill="rgba(251,124,60,0.16)" stroke={BRAND} strokeWidth="1.1" />
        <path d="M190 48h44M190 56h64M190 64h34" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* Linked models — dashed, because Revit will not let you touch these. */}
      {[82, 104].map((y, index) => (
        <g key={y} className="animate-scene-in" style={d(1800 + index * 700)}>
          <rect
            x="182"
            y={y}
            width="112"
            height="20"
            rx="3"
            fill="rgba(94,211,190,0.14)"
            stroke={STEEL}
            strokeWidth="1"
            strokeDasharray="5 3"
          />
          <path d={`M190 ${y + 10}h${40 + index * 22}`} stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round" />
          <path d={`M172 ${y + 10}h8`} stroke={STEEL} strokeWidth="1.2" />
        </g>
      ))}
      <path d="M176 80v24" stroke={STEEL} strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
    </Frame>
  );
}

/* ================================================================== */
/* 13. Coordination & Clash — flagged in the view, clicked for detail  */
/* ================================================================== */

function CoordinationClash() {
  return (
    <Frame label="Architectural elements tested against services and structure, each clash flagged and clicked open">
      {/* The architecture: a wall run and its openings, in section. */}
      <g className="animate-scene-in">
        <rect x="30" y="40" width="252" height="10" fill="url(#cad-hatch)" stroke={LINE} strokeWidth="0.8" />
        <rect x="30" y="104" width="252" height="10" fill="url(#cad-hatch)" stroke={LINE} strokeWidth="0.8" />
        <rect x="116" y="50" width="12" height="54" fill="url(#cad-hatch)" stroke={LINE} strokeWidth="0.8" />
        <rect x="204" y="50" width="12" height="54" fill="url(#cad-hatch)" stroke={LINE} strokeWidth="0.8" />
      </g>

      {/* Services running through it, which is where the trouble is. */}
      <g className="animate-scene-in" style={d(400)}>
        <rect x="24" y="62" width="272" height="14" fill="rgba(94,211,190,0.2)" stroke={STEEL} strokeWidth="0.9" />
        <path d="M24 69h272" stroke="rgba(94,211,190,0.55)" strokeWidth="0.7" strokeDasharray="7 4" />
      </g>
      <g className="animate-scene-in" style={d(650)}>
        <path d="M60 30v96" stroke="rgba(147,205,253,0.7)" strokeWidth="5" />
        <path d="M244 30v96" stroke="rgba(147,205,253,0.7)" strokeWidth="5" />
      </g>

      {/* The hits. */}
      {[
        { x: 122, delay: 1200 },
        { x: 210, delay: 1450 },
        { x: 60, delay: 1700 },
      ].map((hit) => (
        <g
          key={hit.x}
          className="animate-scene-pop"
          style={{ ...d(hit.delay), transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx={hit.x} cy="69" r="11" fill="rgba(245,95,22,0.22)" stroke={BRAND_DEEP} strokeWidth="1.4" />
          <circle cx={hit.x} cy="69" r="3.4" fill={BRAND_DEEP} />
        </g>
      ))}

      {/* Each one flagged in the 3D view. */}
      {[122, 210].map((x, index) => (
        <g key={`flag-${x}`} className="animate-scene-in" style={d(2100 + index * 200)}>
          <path d={`M${x} 58V34`} stroke="#fff" strokeWidth="1.3" />
          <path d={`M${x} 34l18 5.5-18 5.5z`} fill={BRAND_DEEP} stroke="#fff" strokeWidth="0.8" className="animate-scene-flag" />
        </g>
      ))}

      {/* And clicked, which is the whole point of keeping it inside Revit. */}
      <g>
        <animate
          attributeName="opacity"
          values="0;0;1;1;0;0"
          keyTimes="0;0.4;0.46;0.78;0.84;1"
          dur="9s"
          repeatCount="indefinite"
        />
        <circle cx="128" cy="40" r="4" fill="none" stroke="#fff" strokeWidth="1.4">
          <animate
            attributeName="r"
            values="3;3;16;16"
            keyTimes="0;0.5;0.58;1"
            dur="9s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0 0 1 1;0.22 1 0.36 1;0 0 1 1"
          />
          <animate attributeName="opacity" values="0;0;0.9;0;0" keyTimes="0;0.5;0.53;0.58;1" dur="9s" repeatCount="indefinite" />
        </circle>
        {/* The detail the flag opens. */}
        <g className="animate-scene-in" style={d(5000)}>
          <rect x="150" y="84" width="130" height="38" rx="4" fill="rgba(7,23,38,0.92)" stroke={BRAND_DEEP} strokeWidth="1.1" />
          <path d="M160 96h58M160 105h84M160 114h44" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        {/* The pointer that did it. */}
        <path
          d="M0 0v15l3.6-3.6 2.8 5.6 3.3-1.7-2.8-5.4H11z"
          fill="#fff"
          stroke="#061422"
          strokeWidth="0.7"
          transform="translate(128 40)"
        />
      </g>
    </Frame>
  );
}

/* ================================================================== */
/* 14. Interior Shop Drawing — the room, set out and dimensioned       */
/* ================================================================== */

function InteriorShopDrawing() {
  return (
    <Frame label="An interior room set out, dimensioned and issued as a shop drawing sheet">
      <Sheet x={20} y={30} w={276} h={100}>
        {/* The room, with its joinery and loose furniture. */}
        <rect x="46" y="44" width="150" height="66" fill="rgba(255,255,255,0.03)" stroke={LINE} strokeWidth="1.1" />
        <g className="animate-scene-in" style={d(400)}>
          <rect x="52" y="50" width="56" height="14" rx="2" fill="rgba(251,124,60,0.4)" stroke={BRAND} strokeWidth="0.7" />
          <path d="M70 50v14M89 50v14" stroke="rgba(255,255,255,0.45)" strokeWidth="0.7" />
        </g>
        <g className="animate-scene-in" style={d(700)}>
          <rect x="58" y="76" width="46" height="24" rx="2" fill="rgba(94,211,190,0.26)" stroke={STEEL} strokeWidth="0.7" />
          <rect x="120" y="78" width="30" height="20" rx="2" fill="rgba(147,205,253,0.24)" stroke={LINE} strokeWidth="0.7" />
        </g>
        <g className="animate-scene-in" style={d(1000)}>
          <rect x="160" y="50" width="30" height="50" fill="rgba(251,124,60,0.22)" stroke={BRAND} strokeWidth="0.7" />
          <path d="M160 66h30M160 82h30" stroke="rgba(251,124,60,0.6)" strokeWidth="0.6" />
        </g>

        {/* The elevation that comes with it. */}
        <g className="animate-scene-in" style={d(1400)}>
          <rect x="212" y="52" width="66" height="44" fill="rgba(7,23,38,0.6)" stroke={LINE} strokeWidth="0.9" />
          <rect x="216" y="70" width="58" height="22" fill="rgba(251,124,60,0.3)" stroke={BRAND} strokeWidth="0.6" />
          <path d="M235 70v22M255 70v22" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
          <path d="M216 62h58" stroke="rgba(147,205,253,0.5)" strokeWidth="0.7" />
        </g>
      </Sheet>

      {/* Setting-out, which is what makes it a shop drawing. */}
      <Dim x1={46} x2={108} y={126} delay={1900} drop={4} />
      <Dim x1={108} x2={196} y={126} delay={2100} drop={4} />
      <Tag x={100} y={34} delay={2400} />
      <g className="animate-scene-in" style={d(2400)} stroke={BRAND} strokeWidth="0.7" fill="none">
        <path d="M106 45L80 52" />
      </g>
    </Frame>
  );
}

/* ================================================================== */
/* 15. Toilet Shop Drawing — fixtures on centres, tiles set out        */
/* ================================================================== */

function ToiletShopDrawing() {
  return (
    <Frame label="A toilet laid out with fixtures on centres, cubicle partitions and a tile setting-out elevation">
      {/* Plan. */}
      <rect x="20" y="34" width="150" height="92" fill="rgba(255,255,255,0.03)" stroke={LINE} strokeWidth="1.1" />
      {/* The duct zone the whole room is set out from. */}
      <g className="animate-scene-in" style={d(200)}>
        <rect x="20" y="34" width="150" height="12" fill="url(#cad-hatch)" stroke={LINE} strokeWidth="0.8" />
      </g>

      {/* WCs in their cubicles, on centres. */}
      {[30, 66, 102].map((x, index) => (
        <g key={x} className="animate-scene-in" style={d(500 + index * 280)}>
          <rect x={x} y="46" width="34" height="42" fill="rgba(147,205,253,0.08)" stroke={FAINT} strokeWidth="0.7" />
          <rect x={x + 10} y="50" width="14" height="18" rx="4" fill="rgba(94,211,190,0.3)" stroke={STEEL} strokeWidth="0.8" />
          {/* Cubicle door, with its swing. */}
          <g stroke={BRAND} strokeWidth="0.8" fill="none">
            <path d={`M${x + 4} 88v-12`} />
            <path d={`M${x + 4} 76A12 12 0 0 0 ${x + 16} 88`} strokeDasharray="2 2" />
          </g>
        </g>
      ))}
      {/* Partitions between them. */}
      <g className="animate-scene-in" style={d(1500)} stroke={BRAND} strokeWidth="2">
        <path d="M64 46v42M100 46v42M136 46v42" />
      </g>

      {/* Basins on the opposite run. */}
      {[36, 72, 108].map((x, index) => (
        <g
          key={`b${x}`}
          className="animate-scene-pop"
          style={{ ...d(1900 + index * 200), transformBox: "fill-box", transformOrigin: "center" }}
        >
          <rect x={x} y="104" width="26" height="14" rx="3" fill="rgba(94,211,190,0.3)" stroke={STEEL} strokeWidth="0.8" />
          <circle cx={x + 13} cy="111" r="3" fill="none" stroke={STEEL} strokeWidth="0.7" />
        </g>
      ))}

      {/* Tile setting-out on the elevation, cut tiles pushed to the corner. */}
      <rect x="184" y="34" width="114" height="92" rx="3" fill="rgba(7,23,38,0.62)" stroke={FAINT} />
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => {
          const cut = col === 0 || col === 5;
          return (
            <rect
              key={`${row}-${col}`}
              x={190 + col * 17}
              y={42 + row * 16}
              width={cut ? 9 : 16}
              height="15"
              fill={cut ? "rgba(251,124,60,0.3)" : "rgba(147,205,253,0.14)"}
              stroke="rgba(147,205,253,0.32)"
              strokeWidth="0.5"
              className="animate-scene-in"
              style={d(2300 + row * 170 + col * 50)}
            />
          );
        }),
      )}
      <g className="animate-scene-in" style={d(3400)} stroke={BRAND_DEEP} strokeWidth="0.8" strokeDasharray="6 3">
        <path d="M241 28v104" />
      </g>
      <Dim x1={30} x2={66} y={131} delay={3600} drop={4} />
    </Frame>
  );
}

/* ================================================================== */
/* 16. Kitchen Shop Drawing — cabinetry on its module, plus elevation  */
/* ================================================================== */

function KitchenShopDrawing() {
  const modules = [0, 1, 2, 3, 4];

  return (
    <Frame label="Kitchen cabinetry set out on its module in plan, with the run elevation and unit tags">
      {/* Plan: the run against the wall, with the island off it. */}
      <rect x="20" y="34" width="132" height="92" fill="rgba(255,255,255,0.03)" stroke={LINE} strokeWidth="1.1" />
      <g className="animate-scene-in" style={d(300)}>
        <rect x="20" y="40" width="132" height="14" fill="rgba(251,124,60,0.35)" stroke={BRAND} strokeWidth="0.8" />
        <g stroke="rgba(255,255,255,0.45)" strokeWidth="0.7">
          <path d="M46 40v14M72 40v14M98 40v14M124 40v14" />
        </g>
      </g>
      <g className="animate-scene-in" style={d(700)}>
        <circle cx="58" cy="47" r="4" fill="none" stroke="#fff" strokeWidth="0.8" />
        <rect x="104" y="42" width="16" height="10" rx="1" fill="rgba(94,211,190,0.35)" stroke={STEEL} strokeWidth="0.7" />
      </g>
      <g className="animate-scene-in" style={d(1000)}>
        <rect x="42" y="86" width="86" height="22" rx="2" fill="rgba(147,205,253,0.24)" stroke={LINE} strokeWidth="0.8" />
      </g>

      {/* Elevation of the run: base, wall and tall units on the module. */}
      <rect x="166" y="34" width="132" height="92" rx="3" fill="rgba(7,23,38,0.62)" stroke={FAINT} />
      {modules.map((i) => (
        <g key={i} className="animate-scene-in" style={d(1500 + i * 280)}>
          {/* Wall unit */}
          <rect
            x={174 + i * 24}
            y="44"
            width="22"
            height="22"
            fill="rgba(251,124,60,0.28)"
            stroke={BRAND}
            strokeWidth="0.7"
          />
          <circle cx={174 + i * 24 + 18} cy="62" r="1.2" fill="#fff" />
          {/* Base unit */}
          <rect
            x={174 + i * 24}
            y="86"
            width="22"
            height="24"
            fill="rgba(251,124,60,0.2)"
            stroke={BRAND}
            strokeWidth="0.7"
          />
          <path d={`M${174 + i * 24 + 3} 92h16`} stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
        </g>
      ))}
      {/* Worktop and splashback, applied from the finishes schedule. */}
      <g className="animate-scene-in" style={d(3000)}>
        <rect x="174" y="80" width="118" height="6" fill="rgba(94,211,190,0.6)" />
        <rect x="174" y="66" width="118" height="14" fill="rgba(147,205,253,0.14)" stroke="rgba(147,205,253,0.3)" strokeWidth="0.5" />
      </g>
      <g className="animate-scene-in" style={d(3200)}>
        <path d="M174 110h118" stroke={LINE} strokeWidth="1" />
      </g>

      {/* The unit tag the joiner builds to. */}
      <Tag x={182} y={116} delay={3500} w={20} />
      <Tag x={254} y={116} delay={3700} w={20} />
      <Dim x1={174} x2={198} y={131} delay={3900} drop={4} />
    </Frame>
  );
}

/* ================================================================== */
/* 17. Ceiling Shop Drawing — the framing under the grid               */
/* ================================================================== */

function CeilingShopDrawing() {
  return (
    <Frame label="A ceiling framing model with hangers, noggins and openings cut for every service">
      <rect x="22" y="30" width="276" height="96" fill="rgba(255,255,255,0.03)" stroke={LINE} strokeWidth="1.1" />
      {/* The finished grid, held faint — the framing is what is being drawn. */}
      <rect x="22" y="30" width="276" height="96" fill="url(#ceiling-grid)" opacity="0.5" />

      {/* Primary channels. */}
      {[46, 78, 110].map((y, index) => (
        <g key={y} className="animate-scene-in" style={d(300 + index * 280)}>
          <rect x="26" y={y - 2} width="268" height="4" fill="rgba(251,124,60,0.5)" stroke={BRAND} strokeWidth="0.6" />
        </g>
      ))}
      {/* Secondary channels, at centres, across them. */}
      {Array.from({ length: 11 }).map((_, i) => (
        <rect
          key={i}
          x={30 + i * 25}
          y="40"
          width="2.6"
          height="78"
          fill="rgba(94,211,190,0.6)"
          className="animate-scene-in"
          style={d(1300 + i * 110)}
        />
      ))}
      {/* Hangers, where the channels cross the slab fixing lines. */}
      {[46, 78, 110].map((y) =>
        [55, 130, 205, 280].map((x) => (
          <g
            key={`${x}-${y}`}
            className="animate-scene-pop"
            style={{ ...d(2600 + (x % 100) * 4), transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle cx={x} cy={y} r="3.4" fill="none" stroke="#fff" strokeWidth="1.1" />
            <path d={`M${x - 2.4} ${y - 2.4}l4.8 4.8M${x + 2.4} ${y - 2.4}l-4.8 4.8`} stroke="#fff" strokeWidth="0.8" />
          </g>
        )),
      )}
      {/* Openings cut out, with the trimmers that frame them. */}
      {[
        { x: 88, y: 58, w: 34, h: 16 },
        { x: 196, y: 86, w: 30, h: 22 },
      ].map((hole) => (
        <g key={hole.x} className="animate-scene-in" style={d(3200)}>
          <rect x={hole.x} y={hole.y} width={hole.w} height={hole.h} fill="rgba(6,20,34,0.92)" stroke={BRAND_DEEP} strokeWidth="1.3" />
          <path
            d={`M${hole.x - 4} ${hole.y - 3}h${hole.w + 8}M${hole.x - 4} ${hole.y + hole.h + 3}h${hole.w + 8}`}
            stroke={BRAND_DEEP}
            strokeWidth="2"
          />
        </g>
      ))}
      <Dim x1={30} x2={55} y={131} delay={3800} drop={4} />
    </Frame>
  );
}

/* ================================================================== */
/* 18. Drywall Shop Drawing — studs at centres, openings framed        */
/* ================================================================== */

function DrywallShopDrawing() {
  const studs = Array.from({ length: 13 });

  return (
    <Frame label="A partition framed out in elevation with studs at centres, an opening framed, and the board layout">
      {/* Head and base track. */}
      <g className="animate-scene-in" style={d(200)}>
        <rect x="22" y="34" width="276" height="6" fill="rgba(251,124,60,0.45)" stroke={BRAND} strokeWidth="0.7" />
        <rect x="22" y="114" width="276" height="6" fill="rgba(251,124,60,0.45)" stroke={BRAND} strokeWidth="0.7" />
      </g>

      {/* Studs, dropping in at centres. */}
      {studs.map((_, i) => {
        const x = 26 + i * 21;
        // The opening eats the studs it passes through; those come back as
        // cripples over the head.
        const inOpening = x > 118 && x < 186;
        return (
          <g key={i} className="animate-scene-in" style={d(500 + i * 150)}>
            <rect
              x={x}
              y={inOpening ? 40 : 40}
              width="3.4"
              height={inOpening ? 22 : 74}
              fill="rgba(94,211,190,0.75)"
            />
          </g>
        );
      })}

      {/* The opening: jambs, head, cripples. */}
      <g className="animate-scene-in" style={d(2600)} fill={BRAND}>
        <rect x="114" y="62" width="4.5" height="52" />
        <rect x="182" y="62" width="4.5" height="52" />
        <rect x="114" y="62" width="72.5" height="5" />
        <rect x="110" y="40" width="4.5" height="74" />
        <rect x="186" y="40" width="4.5" height="74" />
      </g>

      {/* Board setting-out over the frame, joints staggered. */}
      {[
        { x: 22, y: 40, w: 62, h: 37 },
        { x: 84, y: 40, w: 62, h: 37 },
        { x: 146, y: 40, w: 62, h: 37 },
        { x: 208, y: 40, w: 62, h: 37 },
        { x: 52, y: 77, w: 62, h: 37 },
        { x: 114, y: 77, w: 62, h: 37 },
        { x: 176, y: 77, w: 62, h: 37 },
      ].map((board, i) => (
        <rect
          key={`${board.x}-${board.y}`}
          x={board.x}
          y={board.y}
          width={board.w}
          height={board.h}
          fill="rgba(147,205,253,0.1)"
          stroke="rgba(147,205,253,0.45)"
          strokeWidth="0.7"
          strokeDasharray="4 3"
          className="animate-scene-in"
          style={d(3400 + i * 170)}
        />
      ))}

      <Dim x1={26} x2={47} y={130} delay={4600} drop={4} />
    </Frame>
  );
}

/* ================================================================== */
/* 19. Wardrobe Shop Drawing — carcass, doors, hardware, cut list      */
/* ================================================================== */

function WardrobeShopDrawing() {
  return (
    <Frame label="A wardrobe broken into carcass panels with doors, hardware and a panel cut list">
      {/* The carcass, panel by panel. */}
      <g className="animate-scene-in" style={d(300)}>
        <rect x="24" y="34" width="180" height="88" fill="rgba(7,23,38,0.5)" stroke={BRAND} strokeWidth="1.4" />
      </g>
      {/* Verticals split it into bays. */}
      {[84, 144].map((x, index) => (
        <rect
          key={x}
          x={x}
          y="34"
          width="4"
          height="88"
          fill="rgba(251,124,60,0.7)"
          className="animate-scene-in"
          style={d(700 + index * 250)}
        />
      ))}
      {/* Shelves and the hanging rails. */}
      {[
        { x: 28, y: 58, w: 56 },
        { x: 28, y: 80, w: 56 },
        { x: 148, y: 66, w: 52 },
        { x: 148, y: 90, w: 52 },
      ].map((shelf, index) => (
        <rect
          key={`${shelf.x}-${shelf.y}`}
          x={shelf.x}
          y={shelf.y}
          width={shelf.w}
          height="3"
          fill="rgba(147,205,253,0.6)"
          className="animate-scene-in"
          style={d(1300 + index * 200)}
        />
      ))}
      <g className="animate-scene-in" style={d(2100)}>
        <rect x="90" y="50" width="52" height="3" rx="1.5" fill={STEEL} />
        {[98, 110, 122, 134].map((x) => (
          <path key={x} d={`M${x} 53v10`} stroke={STEEL} strokeWidth="1" />
        ))}
      </g>

      {/* Doors over the carcass, with their hardware. */}
      {[24, 84, 144].map((x, index) => (
        <g key={`door${x}`} className="animate-scene-in" style={d(2600 + index * 260)}>
          <rect
            x={x + 2}
            y="36"
            width={index === 2 ? 58 : 56}
            height="84"
            fill="rgba(147,205,253,0.12)"
            stroke="rgba(147,205,253,0.5)"
            strokeWidth="0.8"
          />
          <rect x={x + (index === 2 ? 52 : 48)} y="72" width="4" height="14" rx="2" fill="#fff" />
        </g>
      ))}

      {/* The cut list that goes with it. */}
      <rect x="216" y="34" width="82" height="88" rx="4" fill="rgba(7,23,38,0.68)" stroke={FAINT} />
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i} className="animate-scene-in" style={d(3600 + i * 200)}>
          <rect x="224" y={44 + i * 13} width="30" height="4.5" rx="2.2" fill="rgba(147,205,253,0.45)" />
          <rect x="260" y={44 + i * 13} width={16 + (i % 3) * 8} height="4.5" rx="2.2" fill={BRAND} />
        </g>
      ))}
    </Frame>
  );
}

/* ================================================================== */
/* 20. As-Built Drawings — the mark-up is read, the drawing corrected  */
/* ================================================================== */

function AsBuiltDrawings() {
  return (
    <Frame label="Site mark-ups read off a drawing and the record drawing corrected to them">
      <Sheet x={30} y={32} w={256} h={96}>
        {/* The drawing as issued. */}
        <g stroke={LINE} strokeWidth="1" fill="none">
          <rect x="46" y="46" width="94" height="66" />
          <rect x="152" y="46" width="118" height="30" />
          <rect x="152" y="82" width="118" height="30" />
        </g>
      </Sheet>

      {/* The red-line, in the hand it is always in. */}
      <g className="animate-scene-in" style={d(700)} stroke={BRAND_DEEP} strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M152 76h118" strokeDasharray="6 4" />
        <path d="M186 40q10 6 2 12t4 12" />
        <path d="M108 46v66" />
      </g>
      <g
        className="animate-scene-pop"
        style={{ ...d(1100), transformBox: "fill-box", transformOrigin: "center" }}
      >
        <circle cx="108" cy="79" r="10" fill="none" stroke={BRAND_DEEP} strokeWidth="1.4" strokeDasharray="4 3" />
      </g>

      {/* The correction, taken into the drawing itself. */}
      <g className="animate-scene-in" style={d(2000)}>
        <path d="M108 46v66" stroke={LINE} strokeWidth="1.6" />
        <path d="M152 68h118" stroke={LINE} strokeWidth="1.2" />
      </g>
      {/* And the record stamp that closes it. */}
      <g
        className="animate-scene-pop"
        style={{ ...d(2600), transformBox: "fill-box", transformOrigin: "center" }}
      >
        <rect x="216" y="94" width="58" height="22" rx="3" fill="rgba(94,211,190,0.85)" stroke="#fff" strokeWidth="1.2" />
        <path d="M230 105l5 5 12-12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Cards 2 to 20. Card 1 (CAD-to-Revit) is drawn in `ToolScene`, because it
 * belongs to every discipline rather than to architecture alone.
 */
export const ARCHITECTURE_SCENES: Record<string, () => ReactNode> = {
  "site-feasibility-automation": SiteFeasibility,
  "concept-design-automation": UnitPlanning,
  "schedule-automation": ScheduleAutomation,
  "parking-mobility-automation": ParkingMobility,
  "ramp-staircase-automation": RampStaircase,
  "unit-planning-automation": DesignDevelopment,
  "ceiling-generation-automation": CeilingGeneration,
  "detailed-design-automation": DetailedDesign,
  "parameter-automation": ParameterAutomation,
  "coordination-clash-automation": CoordinationClash,
  "interior-shop-drawing-automation": InteriorShopDrawing,
  "toilet-shop-drawing-automation": ToiletShopDrawing,
  "kitchen-shop-drawing-automation": KitchenShopDrawing,
  "ceiling-shop-drawing-automation": CeilingShopDrawing,
  "drywall-shop-drawing-automation": DrywallShopDrawing,
  "wardrobe-shop-drawing-automation": WardrobeShopDrawing,
  "as-built-drawing-automation": AsBuiltDrawings,
};

export default ARCHITECTURE_SCENES;
