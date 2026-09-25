import type { ReactNode } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductMark from "@/components/common/ProductMark";
import { softwarePlatformMap } from "@/data/software";
import { toolHref } from "@/data/tools";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { SoftwarePlatform, Tool } from "@/types";

/**
 * The card's material.
 *
 * Four things, and it falls apart if any one of them is missing: a hairline
 * of white along the top edge where the light catches, a tight shadow that
 * sits the card on the page, a wide soft one that lifts it off it, and — from
 * the host application's own colour — a ring just outside the border, so the
 * edge reads as lit rather than drawn. The ring is at four per cent: enough
 * to see on white, not enough to be a glow.
 */
const ringFor = (accent: string) => ({
  boxShadow: `0 0 0 4px ${accent}0A, inset 0 1px 0 rgba(255,255,255,0.95), 0 1px 2px rgba(6,20,34,0.04), 0 10px 24px -12px rgba(6,20,34,0.14), 0 28px 56px -28px rgba(6,20,34,0.22)`,
});

/**
 * The colour of the application a card plugs into — Revit blue on a Revit
 * card, and whatever the host uses on anything else.
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
 * The host application's mark, merged into the top-right corner of the card.
 * Flush into the corner rather than inset from it, and the same fixed square
 * on every card and on both faces.
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
 * is what makes a wall of these read as one product family.
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

/** The type both faces are set in — one size, so nothing changes as the card turns. */
const CARD_TITLE =
  "line-clamp-2 text-balance font-display text-card-title font-bold lg:text-card-title-lg";
const CARD_BODY = "text-card-body text-ink-600";

/** The buttons along the bottom of both faces, at one size. */
const BUTTON = "flex h-11 flex-1 items-center justify-center gap-2 rounded-lg text-[0.875rem] font-medium transition-colors";
/** Outline only, no fill — orange for the demo and Buy, ink for Explore. */
const BUTTON_ORANGE = "border-[1.5px] border-brand-500 bg-white font-semibold text-brand-600 hover:bg-brand-50";
const BUTTON_INK = "border-[1.5px] border-ink-900 bg-white font-semibold text-ink-900 hover:bg-ink-50";

/**
 * One face of the card: the host's mark in the corner, the name, the sentence
 * that explains the tool, and a row of actions at the foot.
 */
function Face({
  tool,
  platform,
  accent,
  className,
  children,
}: {
  tool: Tool;
  platform?: SoftwarePlatform;
  accent: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col overflow-hidden rounded-2xl border bg-white p-6 lg:p-7",
        "[backface-visibility:hidden]",
        className,
      )}
      style={{ borderColor: `${accent}59`, ...ringFor(accent) }}
    >
      <PlatformCorner platform={platform} />

      <h3 className={cn("max-w-[calc(100%-3.5rem)] shrink-0 pb-0.5", CARD_TITLE)}>
        <ToolName name={tool.name} />
      </h3>

      {/* Never squeezed: a long sentence is clamped rather than crushing the title above it. */}
      <p className={cn("mt-3 line-clamp-4 shrink-0", CARD_BODY)}>{tool.summary}</p>

      <div className="mt-auto flex gap-2.5 pt-5">{children}</div>
    </div>
  );
}

/**
 * The product card.
 *
 * Both faces are the same card: the host application's mark in the top-right
 * corner, the name, the one sentence that explains the tool, and the actions
 * along the foot. The front offers a demo; turned over, the back offers the
 * tool page and a purchase. Same type, same sizes, same colours on both, so
 * the only thing that changes as it turns is what you can do next.
 *
 * The flip is behind `@media (hover: hover)`, because a card that turns over
 * on tap is a card a phone user can never read.
 */
export function FlipToolCard({
  tool,
  className,
}: {
  tool: Tool;
  /** 1-based position in the line-up. Kept for callers; the card no longer shows it. */
  index?: number;
  className?: string;
}) {
  // The application the tool runs in — the first one listed is the host.
  const platform = softwarePlatformMap[tool.software[0]];
  // Both faces are outlined in the host application's own colour.
  const accent = hostColour(platform);

  return (
    <div className={cn("group [perspective:1600px]", className)}>
      <div
        className={cn(
          // The proportion, with a floor, so a narrow card still has room for a
          // two-line title and four lines of copy above the buttons.
          "relative aspect-[476/318] min-h-[18rem] w-full",
          "transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "[transform-style:preserve-3d]",
          "[@media(hover:hover)]:group-hover:[transform:rotateY(180deg)]",
          "group-focus-within:[transform:rotateY(180deg)]",
          "motion-reduce:transition-none",
        )}
      >
        {/* Front: the same card as the back, with a demo in place of Explore and Buy. */}
        <Face tool={tool} platform={platform} accent={accent}>
          {/* The empty half keeps the demo where Buy sits on the back, at its size. */}
          <span aria-hidden="true" className="flex-1" />
          <a
            href={whatsappLink(tool.name, "demo")}
            target="_blank"
            rel="noopener noreferrer"
            // Layered over the stretched link below, so the demo takes the
            // click rather than the card it is sitting on.
            className={cn("relative z-20", BUTTON, BUTTON_ORANGE)}
          >
            Book a demo
          </a>

          <Sheen />

          {/* The card as a whole goes to the tool page. */}
          <Link href={toolHref(tool)} className="absolute inset-0 z-10" aria-label={`${tool.name} — read more`} />
        </Face>

        {/* Back — hover-capable pointers only. */}
        <Face
          tool={tool}
          platform={platform}
          accent={accent}
          className="hidden [transform:rotateY(180deg)] [@media(hover:hover)]:flex"
        >
          <Link href={toolHref(tool)} className={cn(BUTTON, BUTTON_INK)}>
            Explore
            <Icon name="arrow-right" className="text-sm" />
          </Link>
          <a
            href={whatsappLink(tool.name, "buy")}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(BUTTON, BUTTON_ORANGE)}
          >
            Buy
          </a>
        </Face>
      </div>
    </div>
  );
}

export default FlipToolCard;
