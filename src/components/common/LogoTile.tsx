import ProductMark, { type ProductMarkSource } from "@/components/common/ProductMark";
import { cn } from "@/lib/utils";

/**
 * A logo in a frame — a fixed square with a hairline stroke around it.
 *
 * The logo set is not a set: square Autodesk badges, a full-bleed Solibri
 * rounded square, and wordmarks four times wider than they are tall. Dropped
 * straight into a list they sit at different widths and every label behind them
 * starts at a different place. The tile fixes the width for all of them, so the
 * marks sit on one grid and the names line up in one column.
 */

const boxes = {
  xs: "h-6 w-6 rounded-[0.35rem] p-[0.1875rem]",
  sm: "h-7 w-7 rounded-md p-1",
  md: "h-11 w-11 rounded-lg p-1.5",
  lg: "h-14 w-14 rounded-xl p-2",
} as const;

export function LogoTile({
  platform,
  size = "sm",
  className,
}: {
  platform: ProductMarkSource;
  size?: keyof typeof boxes;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center border border-ink-200 bg-white",
        boxes[size],
        className,
      )}
    >
      {platform.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={platform.logo}
          alt={`${platform.name} logo`}
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        // No artwork on file: the initials tile fills the frame instead.
        <ProductMark platform={platform} size="xs" className="h-full w-full rounded-[0.2rem]" />
      )}
    </span>
  );
}

export default LogoTile;
