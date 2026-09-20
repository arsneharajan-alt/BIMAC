import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductMark from "@/components/common/ProductMark";
import ToolScene, { hasFullCardScene } from "@/components/marketplace/ToolScene";
import { softwarePlatformMap } from "@/data/software";
import { toolHref } from "@/data/tools";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { vendorLogo } from "@/data/vendor-logos";
import type { SoftwarePlatform, Tool } from "@/types";

/**
 * The gloss.
 *
 * Three things together, because any one of them alone just looks like a
 * mistake: a face that is lighter at the top than at the bottom, a hairline of
 * white along the top edge where the light catches, and a shadow in two parts
 * — a tight one that sits the card on the page and a wide soft one that lifts
 * it off. The sheen itself is a separate pass, below.
 */
const GLOSS =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(6,20,34,0.05),0_14px_30px_-10px_rgba(6,20,34,0.18),0_34px_64px_-28px_rgba(6,20,34,0.28)]";

/**
 * The colour of the application a card plugs into — Revit blue on a Revit’s
 * card, and whatever the host uses on anything else.
 *
 * Taken off the platform rather than written down, so a card that ever leads
 * with Excel or Power BI outlines itself in that product’s colour instead of
 * claiming to be a Revit add-in in blue.
 */
function hostColour(platform?: SoftwarePlatform): string {
  return platform?.mark.color ?? "#0C1015";
}

/** A single diagonal highlight travelling across the face, as on glass. */
function Sheen() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-[5] rounded-2xl",
        "bg-[linear-gradient(112deg,transparent_34%,rgba(255,255,255,0.55)_45%,rgba(255,255,255,0.12)_52%,transparent_62%)]",
        "opacity-60 transition-opacity duration-500 group-hover:opacity-90",
      )}
    />
  );
}

/**
 * The vendor's mark: their own logo where the file is on hand, their name set
 * as type where it is not.
 *
 * The fallback is deliberately close to the real lockup rather than a
 * different idea, so dropping the PNG in changes the weight of the mark and
 * nothing else about the layout. See `vendor-logos`, which is generated.
 */
function VendorMark({
  platform,
  onDark = false,
  height = 18,
}: {
  platform: SoftwarePlatform;
  onDark?: boolean;
  height?: number;
}) {
  const logo = vendorLogo(platform.vendor);

  if (logo) {
    return (
      // A vendor logo is a small static file; the image optimiser adds nothing.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={platform.vendor}
        style={{ height }}
        className={cn("w-auto object-contain object-left", onDark && "brightness-0 invert")}
      />
    );
  }

  return (
    <span className="leading-[1.1]">
      <span
        className={cn(
          "block text-[0.5625rem] font-bold uppercase tracking-[0.04em]",
          onDark ? "text-white" : "text-ink-950",
        )}
      >
        {platform.vendor}
      </span>
      <span className={cn("block text-[0.625rem]", onDark ? "text-white/70" : "text-ink-600")}>
        {platform.shortName}
      </span>
    </span>
  );
}

/**
 * "Revit Add-in │ ▣ Autodesk" — what the card says it plugs into.
 *
 * Along the bottom rather than in a corner, because it is a credential rather
 * than a label: it belongs beside the mark of the thing it extends.
 */
function AddInLockup({
  platform,
  onDark = false,
  className,
}: {
  platform?: SoftwarePlatform;
  onDark?: boolean;
  className?: string;
}) {
  if (!platform) return null;
  return (
    <span
      title={platform.name}
      className={cn("inline-flex shrink-0 items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "whitespace-nowrap text-[0.6875rem] font-semibold tracking-tight",
          onDark ? "text-white" : "text-ink-800",
        )}
      >
        {`${platform.shortName} Add-in`}
      </span>
      <span aria-hidden="true" className={cn("h-5 w-px", onDark ? "bg-white/25" : "bg-ink-200")} />
      <ProductMark platform={platform} size="xs" />
      <VendorMark platform={platform} onDark={onDark} />
    </span>
  );
}

/**
 * The host application's mark, merged into the top-right corner of the card.
 *
 * The mark on its own here, with no wordmark beside it: the back of the card
 * is five things and this is one of them. The full lockup — mark, vendor and
 * product name — belongs on the front, where there is room to read it.
 *
 * Flush into the corner rather than inset from it, and the same fixed square
 * on every card.
 */
function PlatformCorner({ platform }: { platform?: SoftwarePlatform }) {
  if (!platform) return null;
  return (
    <span
      title={platform.name}
      className={cn(
        "absolute right-0 top-0 z-10 grid h-12 w-12 place-items-center bg-white",
        // The card's own corner radius on the outside, a smaller one where it
        // cuts back into the card.
        "rounded-bl-xl rounded-tr-2xl shadow-[0_1px_4px_rgba(6,20,34,0.12)]",
      )}
    >
      <ProductMark platform={platform} size="sm" />
    </span>
  );
}

/**
 * A product name, with the word that names the category picked out.
 *
 * Every tool in the line-up is called "<something> Automation", so the part
 * that varies is set in ink and the part that repeats in brand orange — which
 * is what makes a wall of these read as one product family rather than as
 * nineteen unrelated titles.
 */
function ToolName({ name }: { name: string }) {
  const cut = name.lastIndexOf(" ");
  if (cut < 0) return <span className="text-ink-950">{name}</span>;
  return (
    <>
      <span className="text-ink-950">{name.slice(0, cut)}</span>{" "}
      <span className="text-brand-500">{name.slice(cut + 1)}</span>
    </>
  );
}

/**
 * How big a name can be set before it stops fitting the column.
 *
 * The designed cards do the same thing, computed at build time off a measured
 * character width. This is the house card's version, in the steps the type
 * scale actually offers.
 */
function headingSize(name: string): string {
  if (name.length <= 24) return "text-[1.25rem] lg:text-[1.5rem]";
  if (name.length <= 34) return "text-[1.0625rem] lg:text-[1.25rem]";
  return "text-[0.9375rem] lg:text-[1.0625rem]";
}

/**
 * The product card, with the detail on the back of it.
 *
 * Every card is the shape the designed cards are drawn at — 1280 by 616 — so a
 * card that ships its own design fills its face exactly, with no band of white
 * above and below it, and the house cards sit at the same proportion beside
 * them.
 *
 * A tool that has a card of its own — a finished design carrying its own name,
 * its own copy and its own demo button, moving in step with its artwork — is
 * shown as that card and nothing else. Putting a second title and a second
 * summary around it would only say the same thing twice, in two voices.
 *
 * Everything else gets the house card: the name and what it does on the left,
 * the first few steps it runs through under that, and the tool working on the
 * right, with the demo and the add-in lockup beneath the artwork.
 *
 * The back is five things and no more: the heading, the sentence that explains
 * this one tool, the two ways to act on it, and the vendor's mark in the
 * corner. No artwork behind it, because a sentence over a moving drawing is a
 * sentence nobody finishes.
 *
 * The flip is behind `@media (hover: hover)`, because a card that turns over
 * on tap is a card a phone user can never read.
 */
export function FlipToolCard({
  tool,
  index,
  className,
}: {
  tool: Tool;
  /** 1-based position in the line-up. Omitted, the card carries no number. */
  index?: number;
  className?: string;
}) {
  // The application the tool runs in — the first one listed is the host.
  const platform = softwarePlatformMap[tool.software[0]];
  const number = index === undefined ? null : String(index).padStart(2, "0");
  // A scene that is already a card gets no card built around it.
  const whole = hasFullCardScene(tool.id);
  // Four, like the designed cards show, and no more: the card is as tall as
  // the design it sits beside.
  const steps = tool.features.slice(0, 4);
  // Both faces are outlined in the host application’s own colour.
  const accent = hostColour(platform);

  return (
    <div className={cn("group [perspective:1600px]", className)}>
      <div
        className={cn(
          // The stage is drawn 1280x616, but the Lite cards pin their content
          // to the top of it — the tallest animation panel ends at 418 and the
          // rest is the design's own trailing space. Cropping to 480 keeps
          // every panel and its bottom padding and drops the empty third.
          "relative aspect-[1280/480] w-full",
          "transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "[transform-style:preserve-3d]",
          "[@media(hover:hover)]:group-hover:[transform:rotateY(180deg)]",
          "group-focus-within:[transform:rotateY(180deg)]",
          "motion-reduce:transition-none",
        )}
      >
        {/* Front. */}
        <div
          className={cn(
            "absolute inset-0 overflow-hidden rounded-2xl border-2 bg-gradient-to-b from-white to-ink-50",
            GLOSS,
            "transition-shadow duration-300",
            "[backface-visibility:hidden]",
          )}
          style={{ borderColor: accent }}
        >
          {/* A designed card already ends in its own add-in lockup and its own
              demo button — now that the face is cropped to the design rather
              than letterboxed inside it, that bar is the bottom of the card.
              Anything added here would be a second copy of it. */}
          {whole ? (
            <ToolScene toolId={tool.id} discipline={tool.disciplines[0]} />
          ) : (
            <div className="grid h-full grid-cols-1 sm:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)]">
              {/* The pitch. */}
              <div className="flex min-w-0 flex-col p-5 lg:p-6">
                {number ? (
                  <p className="mb-2 font-mono text-2xs tracking-[0.18em] text-ink-400">{number}</p>
                ) : null}

                <h3
                  className={cn(
                    "text-balance font-display font-bold leading-[1.1] tracking-tight",
                    // Sized off the name rather than clamped: a title cut off
                    // mid-word reads as a card nobody finished.
                    headingSize(tool.name),
                  )}
                >
                  <ToolName name={tool.name} />
                </h3>

                <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-600">
                  {tool.summary}
                </p>

                {/* What it runs through, in order. */}
                <ol className="mt-3.5 space-y-2">
                  {steps.map((step, stepIndex) => (
                    <li key={step} className="flex gap-2.5">
                      <span
                        className={cn(
                          "mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full",
                          "font-mono text-[0.5625rem] leading-none",
                          stepIndex === 0 ? "bg-brand-500 text-white" : "bg-ink-100 text-ink-500",
                        )}
                      >
                        {stepIndex + 1}
                      </span>
                      <span className="line-clamp-2 min-w-0 text-[0.75rem] leading-snug text-ink-700">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* The tool at work, with the demo and the lockup beneath it. */}
              <div className="flex min-w-0 flex-col">
                {/* min-height matters when the card stacks: a grid row sizes to
                    its content, and flex-1 on its own would leave the artwork
                    nothing to fill. */}
                {/* Framed the way the designed cards frame their mocked Revit
                    session, so a card still waiting for its design sits in the
                    same furniture as the ones that have one. */}
                <div className="relative min-h-[8rem] flex-1 p-3 pl-0">
                  <div className="relative h-full overflow-hidden rounded-lg bg-ink-950 shadow-[0_0_0_1px_rgba(6,20,34,0.12),0_12px_24px_-12px_rgba(6,20,34,0.35)]">
                    <ToolScene toolId={tool.id} discipline={tool.disciplines[0]} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 bg-gradient-to-b from-ink-50 to-white px-4 py-2.5">
                  <a
                    href={whatsappLink(tool.name, "demo")}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Layered over the stretched link below, so the demo takes
                    // the click rather than the card it is sitting on.
                    className="relative z-20 inline-flex h-9 items-center rounded-lg bg-brand-500 px-3.5 text-[0.8125rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_1px_2px_rgba(6,20,34,0.2)] transition-colors hover:bg-brand-600"
                  >
                    Book a demo
                  </a>

                  <AddInLockup platform={platform} />
                </div>
              </div>
            </div>
          )}

          <Sheen />

          {/* The card as a whole goes to the tool page. Anything that needs its
              own click sits above this — see the demo button's z-index. */}
          <Link
            href={toolHref(tool)}
            className="absolute inset-0 z-10"
            aria-label={`${tool.name} — read more`}
          />
        </div>

        {/* Back — hover-capable pointers only. Five things, and nothing else. */}
        <div
          className={cn(
            "absolute inset-0 hidden flex-col overflow-hidden rounded-2xl",
            "border-2 bg-white p-6 lg:p-7",
            GLOSS,
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
            "[@media(hover:hover)]:flex",
          )}
          style={{ borderColor: accent }}
        >
          <PlatformCorner platform={platform} />

          <h3 className="line-clamp-2 max-w-[calc(100%-3.5rem)] text-balance font-display text-[1.25rem] font-bold leading-[1.1] tracking-tight lg:text-[1.5rem]">
            <ToolName name={tool.name} />
          </h3>

          <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-600">{tool.summary}</p>

          <div className="mt-auto flex gap-2.5 pt-5">
            <Link
              href={toolHref(tool)}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-ink-950 text-[0.875rem] font-medium text-white transition-colors hover:bg-ink-900"
            >
              Explore
              <Icon name="arrow-right" className="text-sm" />
            </Link>
            <a
              href={whatsappLink(tool.name, "buy")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-500 text-[0.875rem] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-colors hover:bg-brand-600"
            >
              Buy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlipToolCard;
