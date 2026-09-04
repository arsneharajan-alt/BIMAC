"use client";

import Icon from "@/components/ui/Icon";
import { disciplineFamilies } from "@/data/disciplines";
import { cn } from "@/lib/utils";

/**
 * "What do you work with?" — the first decision a visitor makes.
 * MEPF is one tab here; the seven services split out in the sidebar filter.
 */
export function DisciplineTabs({
  active,
  onChange,
  counts,
}: {
  active: string;
  onChange: (id: string) => void;
  counts: Record<string, number>;
}) {
  const tabs = [
    { id: "all", label: "All tools", glyph: "grid" as const },
    ...disciplineFamilies.map((family) => ({
      id: family.id,
      label: family.shortName,
      glyph: family.glyph,
    })),
  ];

  return (
    <div className="relative -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        role="tablist"
        aria-label="Disciplines"
        className="flex min-w-max items-center gap-1 border-b border-ink-200"
      >
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2 whitespace-nowrap px-3.5 py-3 text-[0.875rem] font-medium tracking-tight transition-colors",
                isActive ? "text-brand-600" : "text-ink-600 hover:text-ink-950",
              )}
            >
              <Icon
                name={tab.glyph}
                className={cn("text-[1rem]", isActive ? "text-brand-500" : "text-ink-400")}
              />
              {tab.label}
              <span
                className={cn(
                  "rounded px-1.5 py-px font-mono text-2xs tabular-nums",
                  isActive ? "bg-brand-50 text-brand-700" : "bg-ink-100 text-ink-500",
                )}
              >
                {counts[tab.id] ?? 0}
              </span>
              <span
                className={cn(
                  "absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-500 transition-transform duration-200",
                  isActive ? "scale-x-100" : "scale-x-0",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DisciplineTabs;
