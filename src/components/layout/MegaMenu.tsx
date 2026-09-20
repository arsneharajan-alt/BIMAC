import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { disciplineFamilies } from "@/data/disciplines";
import { cn } from "@/lib/utils";

/**
 * The Products menu.
 *
 * Three routes in — Architecture, Structure, MEP — and nothing else.
 * The lifecycle inside each discipline used to be listed here as sub-headings;
 * it isn't any more, because a visitor picking a discipline does not need to
 * pick a stage on the way, and the extra column of links was one more thing to
 * read before deciding.
 *
 * It hangs directly under the Products button rather than spanning the bar,
 * so the thing you pointed at and the thing that opened are in the same place,
 * and reaching it is a straight move down rather than a diagonal across the
 * whole header.
 */
export function MegaMenu({
  onNavigate,
  open = false,
}: {
  onNavigate: () => void;
  /** Drives the stagger, so the columns settle in each time it opens. */
  open?: boolean;
}) {
  return (
    // pt-2 is the gap to the bar, and it belongs to the panel: it is part of
    // the panel's hover region, so the pointer can travel down into the menu
    // without crossing dead ground.
    <div className="pt-2">
      <div
        className={cn(
          "w-[15rem] rounded-2xl border border-ink-200 bg-white shadow-panel",
          "max-h-[calc(100vh-6.5rem)] overflow-y-auto",
        )}
      >
        <div className="grid gap-1 p-3">
          {disciplineFamilies.map((family, index) => (
            <Link
              key={family.id}
              href={`/tools/${family.slug}`}
              onClick={onNavigate}
              className={cn(
                "group flex items-center justify-between gap-2 rounded-xl px-4 py-4",
                "transition-colors hover:bg-ink-50",
                open && "animate-fade-up",
              )}
              style={open ? { animationDelay: `${40 + index * 45}ms` } : undefined}
            >
              {/* azure-800 reads as the light-ground cousin of ink-950, the one
                  blue every dark section of the site is laid on. */}
              <span className="whitespace-nowrap text-[0.9375rem] font-semibold tracking-tight text-azure-800 group-hover:text-brand-600">
                {family.shortName}
              </span>
              <Icon
                name="arrow-right"
                className="text-[0.7rem] text-brand-500 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MegaMenu;
