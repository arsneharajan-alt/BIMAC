import type { ProductMark as Mark } from "@/types";
import { cn } from "@/lib/utils";

/**
 * A platform's logo.
 *
 * If the vendor's own product logo is on file — `logo` set on the platform,
 * pointing at a file under /public/logos — that is what renders, which is what
 * a visitor expects to see. See public/logos/README.md for the eight files and
 * where each one comes from.
 *
 * Until a logo is on file the platform falls back to `mark`: original artwork,
 * the product's initials set in that product's own colour. Not the vendor's
 * trademark, but scannable in a way eight grey line icons never are.
 */

const sizes = {
  xs: "h-5 w-5 rounded-[0.3rem] text-[0.5rem]",
  sm: "h-7 w-7 rounded-md text-[0.5625rem]",
  md: "h-10 w-10 rounded-lg text-[0.75rem]",
  lg: "h-11 w-11 rounded-xl text-[0.8125rem]",
  xl: "h-14 w-14 rounded-2xl text-base",
} as const;

/** Logos sit on the page unboxed — no tile, no ring, just the mark itself. */
const logoSizes: Record<keyof typeof sizes, string> = {
  xs: "h-5 w-5",
  sm: "h-7 w-7",
  md: "h-10 w-10",
  lg: "h-11 w-11",
  xl: "h-14 w-14",
};

/**
 * ETABS and SAP2000 publish a wordmark, not a square icon — four times wider
 * than it is tall. Squeezed into the square slot it becomes an unreadable
 * smudge, so a wide mark keeps its height and takes the width it needs,
 * left-aligned so the labels beside it still line up.
 */
const wideLogoSizes: Record<keyof typeof sizes, string> = {
  xs: "h-5 w-7",
  sm: "h-6 w-10",
  md: "h-8 w-12",
  lg: "h-9 w-14",
  xl: "h-10 w-16",
};

/**
 * Anything that can be drawn as a product mark. `SoftwarePlatform` satisfies
 * it, and so do the menu entries for applications that have no page yet — the
 * marks are the same artwork either way.
 */
export interface ProductMarkSource {
  name: string;
  logo?: string;
  /** The logo is a wordmark rather than a square icon. */
  logoWide?: boolean;
  mark: Mark;
}

export function ProductMark({
  platform,
  size = "md",
  className,
}: {
  platform: ProductMarkSource;
  size?: keyof typeof sizes;
  className?: string;
}) {
  if (platform.logo) {
    // Vendor logos are small static files — the image optimiser adds nothing.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={platform.logo}
        alt={`${platform.name} logo`}
        className={cn(
          "shrink-0 object-contain",
          platform.logoWide ? `${wideLogoSizes[size]} object-left` : logoSizes[size],
          className,
        )}
      />
    );
  }

  const { letters, color, onColor } = platform.mark;

  return (
    <span
      aria-hidden="true"
      title={platform.name}
      style={{ backgroundColor: color, color: onColor ?? "#FFFFFF" }}
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden font-display font-bold uppercase leading-none tracking-tight",
        // A single top highlight keeps the flat colour from looking like a swatch.
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-white/15 before:content-['']",
        "shadow-[0_1px_2px_rgba(12,16,21,0.16)] ring-1 ring-inset ring-black/10",
        sizes[size],
        className,
      )}
    >
      <span className="relative">{letters}</span>
    </span>
  );
}

export default ProductMark;
