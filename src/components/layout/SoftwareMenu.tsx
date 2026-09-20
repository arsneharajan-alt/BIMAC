import Link from "next/link";
import Icon from "@/components/ui/Icon";
import LogoTile from "@/components/common/LogoTile";
import { softwareMenuColumns, softwareMenuHref } from "@/data/software-menu";
import { cn } from "@/lib/utils";

/**
 * The Software mega menu.
 *
 * Same panel as the Products menu — same width, same four columns, same
 * stagger — so the header has one menu language rather than two. What changes
 * is the axis inside it: category of work first, then the applications in it,
 * and azure rather than brand, because the software axis carries azure
 * wherever it appears.
 */
export function SoftwareMenu({
  onNavigate,
  open = false,
}: {
  onNavigate: () => void;
  /** Drives the stagger, so the columns settle in each time it opens. */
  open?: boolean;
}) {
  return (
    // pt-2 is the gap to the bar, and it belongs to the panel: it is part of
    // the panel own hover region, so the pointer can travel down into the menu
    // without crossing dead ground.
    <div className="pt-2">
      <div
        className={cn(
          "w-[46rem] max-w-[calc(100vw-2rem)] rounded-2xl",
          "border border-ink-200 bg-white shadow-panel",
          // Never taller than the viewport; a long menu scrolls inside itself.
          "max-h-[calc(100vh-6.5rem)] overflow-y-auto",
        )}
      >
        <div className="grid gap-x-6 gap-y-7 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {softwareMenuColumns.map((column, index) => (
            <div
              key={column.id}
              className={cn(open && "animate-fade-up")}
              style={open ? { animationDelay: `${40 + index * 45}ms` } : undefined}
            >
              <Link
                href="/software"
                onClick={onNavigate}
                className="group mb-2 flex items-center gap-1.5 border-b border-ink-100 px-2 pb-2"
              >
                {/* Kept to one line — a wrapped heading drops the rule under
                    it out of step with the other three columns. */}
                <span className="whitespace-nowrap text-[0.75rem] font-semibold uppercase tracking-[0.02em] text-azure-800 group-hover:text-azure-600">
                  {column.title}
                </span>
                <Icon
                  name="arrow-right"
                  className="text-[0.65rem] text-azure-500 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </Link>

              <ul>
                {column.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={softwareMenuHref(item)}
                      onClick={onNavigate}
                      className="group/item flex items-center gap-2.5 rounded-md px-2 py-1 text-xs leading-5 text-ink-600 transition-colors hover:bg-ink-50 hover:text-azure-700"
                    >
                      <LogoTile
                        platform={item}
                        size="sm"
                        className="transition-colors duration-150 group-hover/item:border-azure-300"
                      />
                      {/* Every tile is the same width, so the names sit on one
                          line down the column rather than stepping in and out
                          with each logo. */}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SoftwareMenu;
