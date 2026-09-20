import type { CSSProperties, ReactNode } from "react";
import FlipToolCard from "./FlipToolCard";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types";

export function ToolGrid({
  tools,
  columns = 3,
  className,
}: {
  tools: Tool[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  if (tools.length === 0) return <EmptyState />;

  return (
    <div
      className={cn(
        // The container runs to 100rem, so the widest breakpoints take an extra
        // column rather than stretching cards to an unreadable width.
        "grid gap-5",
        columns === 2 && "sm:grid-cols-2 2xl:grid-cols-3",
        columns === 3 && "sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
        className,
      )}
    >
      {/* Cards cascade in as the grid scrolls up. The stagger is capped so a
          200-card catalogue does not end with a card waiting ten seconds. */}
      {tools.map((tool, index) => (
        <div
          key={tool.id}
          data-reveal="scale"
          style={{ "--reveal-delay": `${Math.min(index, 8) * 55}ms` } as CSSProperties}
          className="flex"
        >
          <FlipToolCard tool={tool} className="w-full" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title = "No tools match these filters",
  message = "Try removing a filter, or widen the discipline selection.",
  action,
}: {
  title?: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-200 bg-ink-50/40 px-6 py-20 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl border border-ink-200 bg-white text-ink-400">
        <Icon name="search" className="text-xl" />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink-900">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-[0.875rem] leading-relaxed text-ink-500">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default ToolGrid;
