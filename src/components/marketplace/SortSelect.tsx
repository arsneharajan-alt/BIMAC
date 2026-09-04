"use client";

import Icon from "@/components/ui/Icon";
import { sortOptions } from "@/lib/tools";
import type { SortId } from "@/types";
import { cn } from "@/lib/utils";

export function SortSelect({
  value,
  onChange,
  className,
}: {
  value: SortId;
  onChange: (value: SortId) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <label htmlFor="product-sort" className="sr-only">
        Sort tools
      </label>
      <span className="pointer-events-none absolute left-3 text-2xs font-medium uppercase tracking-wider text-ink-400">
        Sort
      </span>
      <select
        id="product-sort"
        value={value}
        onChange={(event) => onChange(event.target.value as SortId)}
        className={cn(
          "h-11 appearance-none rounded-lg border border-ink-200 bg-white pl-[3.25rem] pr-9",
          "text-[0.875rem] font-medium text-ink-900 outline-none transition-colors",
          "hover:border-ink-300 focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-500/10",
        )}
      >
        {sortOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevron-down"
        className="pointer-events-none absolute right-3 text-[0.75rem] text-ink-400"
      />
    </div>
  );
}

export default SortSelect;
