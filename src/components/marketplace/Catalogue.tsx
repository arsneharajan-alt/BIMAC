"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import DisciplineTabs from "./DisciplineTabs";
import ToolFilters from "./ToolFilters";
import ToolGrid, { EmptyState } from "./ToolGrid";
import SearchBar from "./SearchBar";
import SortSelect from "./SortSelect";
import { disciplineFamilies, disciplineMap } from "@/data/disciplines";
import { softwareMap } from "@/data/stages";
import {
  countBy,
  emptyFilters,
  filterTools,
  statusLabels,
} from "@/lib/tools";
import { pluralise } from "@/lib/utils";
import type {
  DisciplineFamilyId,
  SortId,
  Tool,
  ToolFilterState,
  ToolStatus,
} from "@/types";

interface ActiveChip {
  key: keyof Pick<ToolFilterState, "disciplines" | "software" | "statuses">;
  value: string;
  label: string;
}

export function Catalogue({
  tools,
  initialFilters,
  showTabs = true,
  showSearch = true,
  columns = 3,
}: {
  tools: Tool[];
  initialFilters?: Partial<ToolFilterState>;
  showTabs?: boolean;
  showSearch?: boolean;
  columns?: 2 | 3 | 4;
}) {
  const [filters, setFilters] = useState<ToolFilterState>({
    ...emptyFilters,
    ...initialFilters,
  });
  const [tab, setTab] = useState<string>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  /** Tab scope applies before the sidebar facets, so the two compose. */
  const scoped = useMemo(() => {
    if (tab === "all") return tools;
    const family = disciplineFamilies.find((item) => item.id === (tab as DisciplineFamilyId));
    if (!family) return tools;
    return tools.filter((tool) =>
      tool.disciplines.some((id) => family.members.includes(id)),
    );
  }, [tools, tab]);

  const visible = useMemo(() => filterTools(scoped, filters), [scoped, filters]);

  const counts = useMemo(() => {
    const base = filterTools(scoped, { ...emptyFilters, query: filters.query });
    return {
      disciplines: countBy(base, (tool) => tool.disciplines),
      software: countBy(base, (tool) => tool.software),
      statuses: countBy(base, (tool) => tool.status),
    };
  }, [scoped, filters.query]);

  const tabCounts = useMemo(() => {
    const result: Record<string, number> = { all: tools.length };
    for (const family of disciplineFamilies) {
      result[family.id] = tools.filter((tool) =>
        tool.disciplines.some((id) => family.members.includes(id)),
      ).length;
    }
    return result;
  }, [tools]);

  const chips: ActiveChip[] = [
    ...filters.disciplines.map((value) => ({
      key: "disciplines" as const,
      value,
      label: disciplineMap[value].shortName,
    })),
    ...filters.software.map((value) => ({
      key: "software" as const,
      value,
      label: softwareMap[value].shortName,
    })),
    ...filters.statuses.map((value) => ({
      key: "statuses" as const,
      value,
      label: statusLabels[value as ToolStatus],
    })),
  ];

  const removeChip = (chip: ActiveChip) => {
    setFilters(
      (current) =>
        ({
          ...current,
          [chip.key]: (current[chip.key] as string[]).filter((item) => item !== chip.value),
        }) as ToolFilterState,
    );
  };

  const resetAll = () => {
    setFilters({ ...emptyFilters, sort: filters.sort });
    setTab("all");
  };

  const filterPanel = <ToolFilters filters={filters} onChange={setFilters} counts={counts} />;

  return (
    <div>
      {showSearch ? (
        <div className="mb-6">
          <SearchBar
            value={filters.query}
            onChange={(query) => setFilters((current) => ({ ...current, query }))}
            placeholder="Search tools — massing, sprinkler, annotation, takeoff..."
          />
        </div>
      ) : null}

      {showTabs ? (
        <div className="mb-7">
          <DisciplineTabs active={tab} onChange={setTab} counts={tabCounts} />
        </div>
      ) : null}

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-[6rem] max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            {filterPanel}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <p className="text-[0.875rem] text-ink-600">
              <span className="font-semibold tabular-nums text-ink-950">{visible.length}</span>{" "}
              {pluralise(visible.length, "tool")}
              {visible.length !== tools.length ? (
                <span className="text-ink-400"> of {tools.length}</span>
              ) : null}
            </p>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-[0.8125rem] font-medium text-ink-800 transition-colors hover:border-ink-300 lg:hidden"
            >
              <Icon name="filter" className="text-[0.9rem] text-brand-500" />
              Filters
              {chips.length > 0 ? (
                <span className="rounded-full bg-brand-500 px-1.5 py-px text-2xs font-semibold text-white">
                  {chips.length}
                </span>
              ) : null}
            </button>

            <SortSelect
              value={filters.sort}
              onChange={(sort: SortId) => setFilters((current) => ({ ...current, sort }))}
              className="ml-auto"
            />
          </div>

          {chips.length > 0 ? (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <button
                  key={`${chip.key}-${chip.value}`}
                  type="button"
                  onClick={() => removeChip(chip)}
                  className="group inline-flex items-center gap-1.5 rounded-md border border-brand-200 bg-brand-50 py-1 pl-2.5 pr-1.5 text-2xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
                >
                  {chip.label}
                  <Icon name="close" className="text-[0.7rem] opacity-60 group-hover:opacity-100" />
                </button>
              ))}
              <button
                type="button"
                onClick={resetAll}
                className="text-2xs font-medium text-ink-500 underline-offset-2 transition-colors hover:text-ink-900 hover:underline"
              >
                Reset
              </button>
            </div>
          ) : null}

          {visible.length === 0 ? (
            <EmptyState
              action={
                <Button variant="secondary" size="sm" onClick={resetAll}>
                  Clear all filters
                </Button>
              }
            />
          ) : (
            <ToolGrid tools={visible} columns={columns} />
          )}
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-[65] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-ink-950/50 animate-fade-in"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-panel">
            <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
              <p className="text-[0.9375rem] font-semibold tracking-tight text-ink-950">
                Filter tools
              </p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="grid h-9 w-9 place-items-center rounded-lg border border-ink-200 text-ink-600"
              >
                <Icon name="close" className="text-base" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">{filterPanel}</div>
            <div className="grid grid-cols-2 gap-2 border-t border-ink-200 p-5">
              <Button variant="secondary" onClick={resetAll}>
                Reset
              </Button>
              <Button onClick={() => setDrawerOpen(false)}>
                Show {visible.length} {pluralise(visible.length, "result")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Catalogue;
