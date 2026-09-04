import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import BlueprintGrid from "@/components/common/BlueprintGrid";
import { EmptyState } from "@/components/marketplace/ToolGrid";
import { groupResults, search } from "@/lib/search";
import { searchSuggestions } from "@/lib/site";
import { pluralise } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search",
  description: "Search BIMAC tools, disciplines, and project stages.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = params.q;
  const query = (Array.isArray(raw) ? raw[0] : raw) ?? "";

  const results = search(query, 60);
  const groups = groupResults(results);

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-200 bg-white">
        <BlueprintGrid
          variant="light"
          fade={false}
          className="opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <Container className="relative">
          <div className="py-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          </div>
          <div className="max-w-3xl pb-10">
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-tightest text-ink-950 sm:text-4xl">
              {query ? (
                <>
                  Results for <span className="text-brand-600">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                "Search BIMAC"
              )}
            </h1>
            {query ? (
              <p className="mt-3 text-[1.0625rem] text-ink-600">
                {results.length} {pluralise(results.length, "result")} across tools, disciplines,
                and project stages.
              </p>
            ) : (
              <p className="mt-3 text-[1.0625rem] text-ink-600">
                Search every tool, discipline, and project stage.
              </p>
            )}

            <form action="/search" className="mt-7 flex gap-2">
              <div className="relative flex h-12 flex-1 items-center rounded-xl border border-ink-200 bg-white transition-all focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10">
                <Icon name="search" className="ml-4 text-base text-ink-400" />
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Search tools — massing, sprinkler, annotation..."
                  aria-label="Search"
                  className="h-full w-full bg-transparent px-3 text-[0.9375rem] text-ink-900 outline-none placeholder:text-ink-400"
                />
              </div>
              <button
                type="submit"
                className="h-12 rounded-xl bg-brand-500 px-6 text-[0.875rem] font-medium text-white transition-colors hover:bg-brand-600"
              >
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-2xs text-ink-400">Try:</span>
              {searchSuggestions.map((suggestion) => (
                <Link
                  key={suggestion}
                  href={`/search?q=${encodeURIComponent(suggestion)}`}
                  className="rounded-md border border-ink-200 px-2.5 py-1 text-2xs text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ink-50/60 py-14 sm:py-16">
        <Container>
          {query && results.length === 0 ? (
            <EmptyState
              title={`No results for "${query}"`}
              message="Try a discipline (architecture, electrical), a stage (documentation), or a task (massing, sprinkler, takeoff)."
              action={
                <Button href="/tools" icon="arrow-right">
                  Browse all tools
                </Button>
              }
            />
          ) : !query ? (
            <EmptyState
              title="Start typing to search"
              message="Every tool, discipline, and project stage is indexed."
              action={
                <Button href="/tools" icon="arrow-right">
                  Browse all tools
                </Button>
              }
            />
          ) : (
            <div className="space-y-10">
              {groups.map((group) => (
                <div key={group.kind}>
                  <div className="mb-4 flex items-center gap-3">
                    <h2 className="font-display text-lg font-semibold tracking-tight text-ink-950">
                      {group.label}
                    </h2>
                    <span className="rounded bg-ink-200/70 px-1.5 py-0.5 font-mono text-2xs text-ink-600">
                      {group.results.length}
                    </span>
                    <span className="h-px flex-1 bg-ink-200" />
                  </div>
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.results.map((result) => (
                      <li key={`${result.kind}-${result.href}-${result.title}`}>
                        <Link
                          href={result.href}
                          className="group flex h-full gap-3.5 rounded-xl border border-ink-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-ink-200 bg-ink-50 text-brand-600">
                            <Icon name={result.glyph} className="text-lg" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-start gap-2">
                              <span className="text-[0.9375rem] font-medium leading-snug tracking-tight text-ink-950 group-hover:text-brand-600">
                                {result.title}
                              </span>
                              <Icon
                                name="arrow-right"
                                className="ml-auto mt-1 shrink-0 text-sm text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-500"
                              />
                            </span>
                            <span className="mt-1.5 line-clamp-2 block text-[0.8125rem] leading-relaxed text-ink-600">
                              {result.description}
                            </span>
                            {result.meta ? (
                              <span className="mt-2 block font-mono text-2xs text-ink-400">
                                {result.meta}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
