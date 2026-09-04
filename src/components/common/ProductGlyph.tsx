import { cn } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import type { GlyphId } from "@/types";

const sizes = {
  sm: "h-10 w-10 rounded-[0.625rem] text-[1.05rem]",
  md: "h-12 w-12 rounded-xl text-[1.35rem]",
  lg: "h-16 w-16 rounded-2xl text-[1.75rem]",
  xl: "h-20 w-20 rounded-[1.125rem] text-[2.15rem]",
} as const;

/**
 * The tile a product wears everywhere it appears — cards, hero, search,
 * related lists. A drafting-grid surface with the product's glyph in brand
 * orange, so the catalogue reads as one family rather than a pile of logos.
 */
export function ProductGlyph({
  glyph,
  size = "md",
  onDark = false,
  className,
}: {
  glyph: GlyphId;
  size?: keyof typeof sizes;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden border",
        sizes[size],
        onDark
          ? "border-white/10 bg-white/[0.06] text-brand-300"
          : "border-ink-200/80 bg-gradient-to-br from-white to-ink-50 text-brand-600",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-grid-sm",
          onDark ? "bg-grid-dark opacity-60" : "bg-grid-light opacity-70",
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-px",
          onDark ? "bg-white/15" : "bg-white",
        )}
      />
      <Icon name={glyph} className="relative" strokeWidth={1.5} />
    </span>
  );
}

export default ProductGlyph;
