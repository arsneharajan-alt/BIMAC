"use client";

import Icon from "@/components/ui/Icon";
import { disciplineFamilies, disciplineMap } from "@/data/disciplines";
import { softwareList } from "@/data/stages";
import { statusLabels, statusOrder } from "@/lib/tools";
import { cn } from "@/lib/utils";
import type {
  DisciplineId,
  SoftwareId,
  ToolFilterState,
  ToolStatus,
} from "@/types";

type FacetKey = "disciplines" | "software" | "statuses";

/** Synthetic row id for the MEPF group toggle — never stored in filter state. */
const MEP_PARENT = "__mep__";

const MEP_MEMBERS: DisciplineId[] =
  disciplineFamilies.find((family) => family.id === "mep")?.members ?? [];

interface FacetRow {
  value: string;
  label: string;
  count: number;
  /** Renders indented — used for the seven MEPF services. */
  nested?: boolean;
  /** The MEPF group row: toggles all seven services together. */
  parent?: boolean;
}

function CheckRow({
  row,
  checked,
  indeterminate = false,
  onToggle,
}: {
  row: FacetRow;
  checked: boolean;
  /** Parent row with only some children selected. */
  indeterminate?: boolean;
  onToggle: () => void;
}) {
  const disabled = row.count === 0 && !checked;
  const marked = checked || indeterminate;
  return (
    <li>
      <label
        className={cn(
          "flex cursor-pointer items-center gap-2.5 rounded-md py-1.5 pr-2 transition-colors",
          row.nested ? "pl-6" : "pl-2",
          disabled ? "cursor-not-allowed opacity-40" : "hover:bg-ink-50",
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onToggle}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            "grid h-4 w-4 shrink-0 place-items-center rounded border transition-all",
            marked
              ? "border-brand-500 bg-brand-500 text-white"
              : "border-ink-300 bg-white text-transparent",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/50 peer-focus-visible:ring-offset-2",
          )}
        >
          <Icon
            name={indeterminate && !checked ? "minus" : "check"}
            className="text-[0.55rem]"
            strokeWidth={3.5}
          />
        </span>
        <span
          className={cn(
            "flex-1 text-[0.8125rem] leading-5",
            row.parent && "font-medium",
            marked ? "font-medium text-ink-900" : "text-ink-600",
          )}
        >
          {row.label}
        </span>
        <span className="font-mono text-2xs tabular-nums text-ink-400">{row.count}</span>
      </label>
    </li>
  );
}

function FacetGroup({
  title,
  rows,
  selected,
  onToggle,
}: {
  title: string;
  rows: FacetRow[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const mepSelected = MEP_MEMBERS.filter((id) => selected.includes(id)).length;

  return (
    <div className="border-t border-ink-200/80 py-5 first:border-0 first:pt-0">
      <p className="mb-2.5 px-2 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        {title}
      </p>
      <ul className="space-y-px">
        {rows.map((row) => {
          const isMepParent = row.value === MEP_PARENT;
          return (
            <CheckRow
              key={row.value}
              row={row}
              checked={
                isMepParent
                  ? mepSelected === MEP_MEMBERS.length && MEP_MEMBERS.length > 0
                  : selected.includes(row.value)
              }
              indeterminate={isMepParent && mepSelected > 0 && mepSelected < MEP_MEMBERS.length}
              onToggle={() => onToggle(row.value)}
            />
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Discipline rows.
 *
 * MEPF gets a real parent row so the indent on its seven services has something
 * to attach to — without it the services read as children of Structure.
 * Ticking the parent selects all seven at once, which is what an MEPF engineer
 * usually wants.
 */
function disciplineRows(counts: Record<string, number>): FacetRow[] {
  const rows: FacetRow[] = [];
  for (const family of disciplineFamilies) {
    if (family.id === "mep") {
      const memberCount = family.members.reduce(
        (total, id) => total + (counts[id] ?? 0),
        0,
      );
      rows.push({
        value: MEP_PARENT,
        label: "MEPF",
        count: memberCount,
        parent: true,
      });
      for (const id of family.members) {
        rows.push({
          value: id,
          label: disciplineMap[id].shortName,
          count: counts[id] ?? 0,
          nested: true,
        });
      }
    } else {
      const id = family.members[0];
      rows.push({
        value: id,
        label: disciplineMap[id].shortName,
        count: counts[id] ?? 0,
      });
    }
  }
  return rows;
}

export function ToolFilters({
  filters,
  onChange,
  counts,
  className,
}: {
  filters: ToolFilterState;
  onChange: (next: ToolFilterState) => void;
  counts: {
    disciplines: Record<string, number>;
    software: Record<string, number>;
    statuses: Record<string, number>;
  };
  className?: string;
}) {
  const toggle = (key: FacetKey, value: string) => {
    const current = filters[key] as string[];

    // The MEPF group row selects or clears all seven services together.
    if (key === "disciplines" && value === MEP_PARENT) {
      const allSelected = MEP_MEMBERS.every((id) => current.includes(id));
      const next = allSelected
        ? current.filter((id) => !MEP_MEMBERS.includes(id as DisciplineId))
        : Array.from(new Set([...current, ...MEP_MEMBERS]));
      onChange({ ...filters, disciplines: next } as ToolFilterState);
      return;
    }

    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next } as ToolFilterState);
  };

  const activeCount =
    filters.disciplines.length +
    filters.software.length +
    filters.statuses.length;

  return (
    <div className={className}>
      <div className="flex items-center justify-between pb-4">
        <p className="flex items-center gap-2 text-[0.9375rem] font-semibold tracking-tight text-ink-950">
          <Icon name="filter" className="text-[0.95rem] text-brand-500" />
          Filters
          {activeCount > 0 ? (
            <span className="rounded-full bg-brand-500 px-1.5 py-0.5 text-2xs font-semibold leading-4 text-white">
              {activeCount}
            </span>
          ) : null}
        </p>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={() =>
              onChange({
                ...filters,
                disciplines: [],
                software: [],
                statuses: [],
              })
            }
            className="text-2xs font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <FacetGroup
        title="Discipline"
        selected={filters.disciplines}
        onToggle={(value) => toggle("disciplines", value as DisciplineId)}
        rows={disciplineRows(counts.disciplines)}
      />

      <FacetGroup
        title="Software"
        selected={filters.software}
        onToggle={(value) => toggle("software", value as SoftwareId)}
        /* Platforms with no listed tool yet — Power BI, P6, ETABS, MS Project —
           belong on /software, not as dead rows in the catalogue facet. */
        rows={softwareList
          .map((software) => ({
            value: software.id,
            label: software.shortName,
            count: counts.software[software.id] ?? 0,
          }))
          .filter((row) => row.count > 0 || filters.software.includes(row.value as SoftwareId))}
      />

      <FacetGroup
        title="Availability"
        selected={filters.statuses}
        onToggle={(value) => toggle("statuses", value as ToolStatus)}
        rows={statusOrder.map((status) => ({
          value: status,
          label: statusLabels[status],
          count: counts.statuses[status] ?? 0,
        }))}
      />
    </div>
  );
}

export default ToolFilters;
