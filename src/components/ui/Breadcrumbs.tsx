import Link from "next/link";
import { cn } from "@/lib/utils";
import Icon from "./Icon";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  className,
  onDark = false,
}: {
  items: Crumb[];
  className?: string;
  onDark?: boolean;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "rounded transition-colors hover:underline underline-offset-2",
                    onDark ? "text-ink-400 hover:text-white" : "text-ink-500 hover:text-ink-900",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn("font-medium", onDark ? "text-white" : "text-ink-900")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <Icon
                  name="chevron-right"
                  className={cn("text-[0.85em]", onDark ? "text-ink-600" : "text-ink-300")}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
