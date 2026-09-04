"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { groupResults, search } from "@/lib/search";
import { searchSuggestions } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Global search.
 *
 * Searches the whole site index rather than product names alone, so "revit"
 * returns Revit products, the Revit hub, related workflows and documentation —
 * and "automation" returns automation products, solutions, and workflows.
 */
export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => search(query, 14), [query]);
  const groups = useMemo(() => groupResults(results), [results]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  if (!open) return null;

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Search BIMAC">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink-950/60 backdrop-blur-sm animate-fade-in"
      />
      <div className="relative mx-auto mt-[8vh] w-[min(46rem,calc(100%-2rem))] animate-scale-in overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-panel">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(query);
          }}
          className="flex items-center gap-3 border-b border-ink-200 px-5"
        >
          <Icon name="search" className="text-lg text-ink-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools — massing, sprinkler, annotation..."
            className="h-16 w-full bg-transparent text-base text-ink-900 outline-none placeholder:text-ink-400"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-ink-200 px-2 py-1 text-2xs font-medium text-ink-500 transition-colors hover:bg-ink-50"
          >
            ESC
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length === 0 ? (
            <div className="p-5">
              <p className="mb-3 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-400">
                Suggested searches
              </p>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="rounded-lg border border-ink-200 px-3 py-1.5 text-[0.8125rem] text-ink-700 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm font-medium text-ink-800">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-[0.8125rem] text-ink-500">
                Try a discipline (architecture, electrical), a stage (documentation), or a task
                (massing, sprinkler, takeoff).
              </p>
            </div>
          ) : (
            <div className="p-2">
              {groups.map((group) => (
                <div key={group.kind} className="mb-1">
                  <p className="px-3 py-2 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-400">
                    {group.label}
                  </p>
                  <ul>
                    {group.results.map((result) => (
                      <li key={`${result.kind}-${result.href}-${result.title}`}>
                        <Link
                          href={result.href}
                          onClick={onClose}
                          className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-ink-50"
                        >
                          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-ink-200 bg-white text-brand-600">
                            <Icon name={result.glyph} className="text-sm" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-baseline gap-2">
                              <span className="truncate text-[0.875rem] font-medium text-ink-900">
                                {result.title}
                              </span>
                              {result.meta ? (
                                <span className="shrink-0 font-mono text-2xs text-ink-400">
                                  {result.meta}
                                </span>
                              ) : null}
                            </span>
                            <span className="mt-0.5 block truncate text-[0.8125rem] text-ink-500">
                              {result.description}
                            </span>
                          </span>
                          <Icon
                            name="arrow-right"
                            className={cn(
                              "mt-2 text-sm text-ink-300 transition-all",
                              "group-hover:translate-x-0.5 group-hover:text-brand-500",
                            )}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <button
                type="button"
                onClick={() => submit(query)}
                className="mt-1 flex w-full items-center justify-between rounded-lg border-t border-ink-100 px-3 py-3 text-[0.8125rem] font-medium text-brand-600 transition-colors hover:bg-brand-50"
              >
                View all results for &ldquo;{query}&rdquo;
                <Icon name="arrow-right" className="text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
