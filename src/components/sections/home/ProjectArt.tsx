import type { Project } from "@/data/projects";

/**
 * The projects, drawn.
 *
 * There are no photographs of these jobs on hand, and a stock image of a
 * building that is not the building is worse than no image at all. So each
 * project gets a drawn scene instead — a residential elevation, a frame going
 * up, a ceiling void full of services — which is honest about being a drawing
 * and reads as the thing BIMAC actually makes.
 *
 * One night palette, one warm accent per scene, so six different subjects
 * still read as one set. Swap in real renders and the cards do not change.
 */

const FACE = "url(#project-face)";
const DEEP = "url(#project-deep)";
const EDGE = "rgba(147,205,253,0.36)";
const GLASS = "rgba(147,205,253,0.22)";
const LIT = "#F55F16";
const WARM = "rgba(245,95,22,0.55)";

const GROUND = 196;

/** Floor lines across a block — the cheapest way to say "storeys". */
function Floors({
  x,
  y,
  w,
  h,
  step = 10,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  step?: number;
}) {
  const lines = [];
  for (let o = step; o < h; o += step) {
    lines.push(<line key={o} x1={x} y1={y + o} x2={x + w} y2={y + o} />);
  }
  return (
    <g stroke={EDGE} strokeWidth="0.6" opacity="0.65">
      {lines}
    </g>
  );
}

function Block({
  x,
  y,
  w,
  h,
  step,
  fill = FACE,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  step?: number;
  fill?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} />
      <Floors x={x} y={y} w={w} h={h} step={step} />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={EDGE} strokeWidth="0.9" />
    </g>
  );
}

function Pane({
  x,
  y,
  w = 6,
  h = 5,
  lit = false,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  lit?: boolean;
}) {
  return <rect x={x} y={y} width={w} height={h} fill={lit ? LIT : GLASS} opacity={lit ? 0.85 : 1} />;
}

/* ------------------------------------------------------------------ */
/* Architecture — a modern residential block                           */
/* ------------------------------------------------------------------ */

function Residential() {
  return (
    <>
      {/* Two masses with a glazed bay set back between them. */}
      <Block x={40} y={56} w={92} h={GROUND - 56} step={26} />
      <Block x={132} y={92} w={56} h={GROUND - 92} step={26} fill={DEEP} />
      <Block x={188} y={70} w={84} h={GROUND - 70} step={26} />

      <rect x={140} y={100} width={40} height={GROUND - 100} fill="rgba(147,205,253,0.10)" />
      <g stroke={EDGE} strokeWidth="0.7">
        {[148, 156, 164, 172].map((x) => (
          <line key={x} x1={x} y1={100} x2={x} y2={GROUND} />
        ))}
      </g>

      {/* Balcony slabs, projecting past the face. */}
      <g fill="rgba(147,205,253,0.18)">
        {[82, 108, 134, 160].map((y) => (
          <rect key={y} x={36} y={y} width={100} height={2.5} />
        ))}
        {[96, 122, 148, 174].map((y) => (
          <rect key={y} x={184} y={y} width={92} height={2.5} />
        ))}
      </g>

      <Pane x={58} y={88} w={14} h={10} lit />
      <Pane x={96} y={140} w={14} h={10} />
      <Pane x={206} y={104} w={14} h={10} />
      <Pane x={240} y={156} w={14} h={10} lit />

      {/* A lit soffit at grade, and two trees for scale. */}
      <rect x={28} y={GROUND - 12} width={256} height={12} fill={WARM} opacity="0.18" />
      {[26, 292].map((x) => (
        <g key={x} stroke={EDGE} strokeWidth="1.1" fill="none">
          <line x1={x} y1={GROUND} x2={x} y2={GROUND - 20} />
          <circle cx={x} cy={GROUND - 26} r="8" fill="rgba(147,205,253,0.10)" />
        </g>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Structures — a concrete frame going up                              */
/* ------------------------------------------------------------------ */

function Frame() {
  const cols = [56, 112, 168, 224];
  const slabs = [70, 112, 154];

  return (
    <>
      <g>
        {cols.map((x) => (
          <rect
            key={x}
            x={x}
            y={60}
            width={13}
            height={GROUND - 60}
            fill={FACE}
            stroke={EDGE}
            strokeWidth="0.8"
          />
        ))}
      </g>

      {/* Slabs, each showing its edge thickness. */}
      {slabs.map((y) => (
        <g key={y}>
          <rect x={42} y={y} width={196} height={9} fill={DEEP} stroke={EDGE} strokeWidth="0.9" />
          <rect x={42} y={y} width={196} height={2} fill="rgba(147,205,253,0.22)" />
        </g>
      ))}

      {/* The top slab still in formwork, props under the fresh pour. */}
      <rect x={42} y={58} width={196} height={7} fill={WARM} opacity="0.35" />
      <g stroke={LIT} strokeWidth="1.2" opacity="0.5">
        {[64, 92, 120, 148, 176, 204, 228].map((x) => (
          <line key={x} x1={x} y1={65} x2={x} y2={70} />
        ))}
      </g>

      {/* Starter bars standing above it. */}
      <g stroke={EDGE} strokeWidth="1" opacity="0.7">
        {[58, 70, 114, 126, 170, 182, 226, 238].map((x) => (
          <line key={x} x1={x} y1={58} x2={x} y2={44} />
        ))}
      </g>

      {/* A crane, because a frame going up has one. */}
      <g stroke={EDGE} strokeWidth="1.3" fill="none">
        <line x1={272} y1={GROUND} x2={272} y2={28} />
        <line x1={196} y1={28} x2={300} y2={28} />
        <line x1={272} y1={16} x2={220} y2={28} />
        <line x1={272} y1={16} x2={296} y2={28} />
        <line x1={230} y1={28} x2={230} y2={52} />
      </g>
      <rect x={224} y={52} width={12} height={9} fill={LIT} opacity="0.75" />

      <rect x={0} y={GROUND} width={320} height={4} fill="rgba(147,205,253,0.16)" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* MEP — a ceiling void, coordinated                                   */
/* ------------------------------------------------------------------ */

function Services() {
  return (
    <>
      {/* The slab over, with hangers dropping off it. */}
      <rect x={0} y={34} width={320} height={12} fill={DEEP} />
      <rect x={0} y={46} width={320} height={2} fill="rgba(147,205,253,0.22)" />
      <g stroke={EDGE} strokeWidth="1">
        {[40, 88, 136, 184, 232, 280].map((x) => (
          <line key={x} x1={x} y1={48} x2={x} y2={92} />
        ))}
      </g>

      {/* The main duct — the biggest thing in any ceiling. */}
      <rect x={16} y={70} width={288} height={30} fill={FACE} stroke={EDGE} strokeWidth="0.9" />
      <rect x={16} y={70} width={288} height={3} fill="rgba(147,205,253,0.20)" />
      <g fill="rgba(147,205,253,0.16)">
        {[70, 134, 198, 262].map((x) => (
          <rect key={x} x={x} y={68} width={4} height={34} />
        ))}
      </g>

      {/* Pipework under it, one run picked out. */}
      <rect x={16} y={116} width={288} height={10} fill={LIT} opacity="0.42" />
      <rect x={16} y={116} width={288} height={2.5} fill={LIT} opacity="0.85" />
      <rect x={16} y={136} width={288} height={9} fill={FACE} stroke={EDGE} strokeWidth="0.8" />

      {/* Cable tray, drawn as the ladder it is. */}
      <g stroke={EDGE} strokeWidth="1">
        <line x1={16} y1={158} x2={304} y2={158} />
        <line x1={16} y1={170} x2={304} y2={170} />
        {Array.from({ length: 13 }, (_, i) => 24 + i * 22).map((x) => (
          <line key={x} x1={x} y1={158} x2={x} y2={170} />
        ))}
      </g>

      {/* A branch dropping to a diffuser in the ceiling below. */}
      <rect x={196} y={100} width={26} height={16} fill={FACE} stroke={EDGE} strokeWidth="0.8" />
      <rect x={0} y={GROUND - 14} width={320} height={14} fill={DEEP} />
      <rect x={0} y={GROUND - 14} width={320} height={2} fill="rgba(147,205,253,0.18)" />
      <rect x={190} y={GROUND - 14} width={38} height={6} fill={WARM} opacity="0.5" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* The rest of the set                                                 */
/* ------------------------------------------------------------------ */

function Towers() {
  return (
    <>
      <Block x={46} y={66} w={44} h={GROUND - 66} />
      <Block x={98} y={40} w={52} h={GROUND - 40} step={13} />
      <Block x={158} y={84} w={38} h={GROUND - 84} />
      <Block x={204} y={58} w={46} h={GROUND - 58} step={13} />
      <Pane x={112} y={60} lit />
      <Pane x={124} y={110} />
      <Pane x={216} y={80} />
      <Pane x={60} y={98} />
    </>
  );
}

function Resort() {
  return (
    <>
      <path
        d="M34 112 L160 78 L286 112 L286 118 L34 118 Z"
        fill={FACE}
        stroke={EDGE}
        strokeWidth="0.9"
      />
      <Block x={60} y={118} w={54} h={GROUND - 118} step={18} />
      <Block x={126} y={126} w={68} h={GROUND - 126} step={18} />
      <Block x={206} y={118} w={54} h={GROUND - 118} step={18} />
      <g stroke={EDGE} strokeWidth="1.1">
        <line x1="44" y1="118" x2="44" y2={GROUND} />
        <line x1="276" y1="118" x2="276" y2={GROUND} />
      </g>
      <Pane x={146} y={142} w={10} h={6} lit />
      <Pane x={76} y={136} w={10} h={6} />
      <Pane x={224} y={136} w={10} h={6} />
    </>
  );
}

function Civic() {
  return (
    <>
      <path
        d="M96 112 A64 54 0 0 1 224 112 L224 120 L96 120 Z"
        fill={FACE}
        stroke={EDGE}
        strokeWidth="0.9"
      />
      <Block x={44} y={120} w={232} h={GROUND - 120} step={80} />
      <g stroke={EDGE} strokeWidth="1.2" opacity="0.8">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={i} x1={62 + i * 28} y1="126" x2={62 + i * 28} y2={GROUND} />
        ))}
      </g>
      <line x1="44" y1="126" x2="276" y2="126" stroke={EDGE} strokeWidth="1.2" />
      <Pane x={154} y={86} w={12} h={7} lit />
    </>
  );
}

const ART: Record<Project["art"], () => React.JSX.Element> = {
  residential: Residential,
  frame: Frame,
  services: Services,
  towers: Towers,
  resort: Resort,
  civic: Civic,
};

export function ProjectArt({ art }: { art: Project["art"] }) {
  const Drawing = ART[art];
  return (
    <svg
      viewBox="0 0 320 200"
      role="presentation"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="project-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B3F5C" />
          <stop offset="100%" stopColor="#071B2B" />
        </linearGradient>
        <linearGradient id="project-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#40617E" />
          <stop offset="100%" stopColor="#16303F" />
        </linearGradient>
        <linearGradient id="project-deep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2F5170" />
          <stop offset="100%" stopColor="#102737" />
        </linearGradient>
      </defs>

      <rect width="320" height="200" fill="url(#project-sky)" />
      <Drawing />
    </svg>
  );
}

export default ProjectArt;
