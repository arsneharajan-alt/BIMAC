"use client";

import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** The large marketplace search field. Filters the grid as you type. */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search tools, plugins and automation...",
  size = "lg",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex items-center rounded-xl border border-ink-200 bg-white transition-all",
        "focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10",
        "hover:border-ink-300 focus-within:hover:border-brand-400",
        size === "lg" ? "h-14 shadow-card" : "h-11",
        className,
      )}
    >
      <Icon
        name="search"
        className={cn(
          "ml-4 text-ink-400 transition-colors group-focus-within:text-brand-500",
          size === "lg" ? "text-lg" : "text-base",
        )}
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search tools"
        spellCheck={false}
        autoComplete="off"
        className={cn(
          "h-full w-full bg-transparent px-3.5 text-ink-900 outline-none placeholder:text-ink-400",
          "[&::-webkit-search-cancel-button]:hidden",
          size === "lg" ? "text-[0.9375rem]" : "text-[0.875rem]",
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="mr-3 grid h-7 w-7 shrink-0 place-items-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
        >
          <Icon name="close" className="text-sm" />
        </button>
      ) : (
        <kbd className="mr-4 hidden shrink-0 rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 font-mono text-2xs text-ink-400 sm:block">
          /
        </kbd>
      )}
    </div>
  );
}

export default SearchBar;
