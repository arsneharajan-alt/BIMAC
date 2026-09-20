import { architectureLineup } from "@/data/catalogue/architecture";
import { mepLineup } from "@/data/catalogue/mep";
import { structureLineup } from "@/data/catalogue/structure";
import { disciplineMap, disciplines, getFamily } from "@/data/disciplines";
import { stages } from "@/data/stages";
import { toolMap, tools } from "@/data/tools";
import type {
  DisciplineFamilyId,
  DisciplineId,
  SoftwareId,
  SortId,
  StageId,
  Tool,
  ToolFilterState,
  ToolStatus,
} from "@/types";

export const statusLabels: Record<ToolStatus, string> = {
  available: "Available",
  "in-development": "In Development",
  planned: "Planned",
};

export const statusOrder: ToolStatus[] = ["available", "in-development", "planned"];

export const sortOptions: { id: SortId; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "status", label: "Availability" },
  { id: "az", label: "A–Z" },
];

export const emptyFilters: ToolFilterState = {
  query: "",
  disciplines: [],
  software: [],
  statuses: [],
  sort: "featured",
};

/* ------------------------------------------------------------------ */
/* Selection                                                           */
/* ------------------------------------------------------------------ */

/** Every tool serving a discipline, including multi-discipline tools. */
export function toolsForDiscipline(id: DisciplineId): Tool[] {
  return tools.filter((tool) => tool.disciplines.includes(id));
}

/**
 * The line-up for a discipline hub: the cards it shows, in the order it shows
 * them.
 *
 * Architecture, Structure and MEP name their cards explicitly — the order on
 * the page is a decision, and a line-up may include a tool another discipline
 * owns. Everything else takes its catalogue in file order, which is already
 * workflow order.
 *
 * It lives here rather than in the hub page because the homepage counts off it
 * too, and a card saying "40 tools" that opens onto 37 is the sort of thing
 * only a visitor ever notices.
 */
const LINEUPS: Partial<Record<DisciplineId, string[]>> = {
  architecture: architectureLineup,
  structure: structureLineup,
  mep: mepLineup,
};

export function disciplineLineup(id: DisciplineId): Tool[] {
  const named = LINEUPS[id];
  if (named) return named.map((toolId) => toolMap[toolId]).filter(Boolean);
  return toolsForDiscipline(id);
}

/** Every tool across a family — MEPF returns all seven services disciplines. */
export function toolsForFamily(id: DisciplineFamilyId): Tool[] {
  const members = getFamily(id).members;
  return tools.filter((tool) =>
    tool.disciplines.some((discipline) => members.includes(discipline)),
  );
}

/** Tools within one group of a discipline, for the hub's grouped sections. */
export function toolsInGroup(disciplineId: DisciplineId, groupId: string): Tool[] {
  return toolsForDiscipline(disciplineId).filter((tool) => {
    // A multi-discipline tool carries its group from its canonical discipline,
    // so match on either that or the shared group name.
    if (tool.disciplines[0] === disciplineId) return tool.group === groupId;
    return tool.group === groupId;
  });
}

export function featuredTools(limit = 6): Tool[] {
  return sortTools(
    tools.filter((tool) => tool.featured),
    "featured",
  ).slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Filtering + sorting                                                 */
/* ------------------------------------------------------------------ */

// Lifecycle order is no longer a browsing axis, but it is still what makes the
// default "featured" sort read as a workflow rather than as a pile.
const stageRank: Record<StageId, number> = stages.reduce(
  (acc, stage, index) => {
    acc[stage.id] = index;
    return acc;
  },
  {} as Record<StageId, number>,
);

const statusRank: Record<ToolStatus, number> = {
  available: 0,
  "in-development": 1,
  planned: 2,
};

function matchesQuery(tool: Tool, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    tool.name,
    tool.summary,
    tool.description,
    tool.group,
    tool.stage,
    ...tool.disciplines,
    ...tool.software,
    ...tool.features,
    ...tool.inputs,
    ...tool.outputs,
  ]
    .join(" ")
    .toLowerCase();
  return needle.split(/\s+/).every((token) => haystack.includes(token));
}

export function sortTools(list: Tool[], sort: SortId): Tool[] {
  const sorted = [...list];
  switch (sort) {
    case "az":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "status":
      return sorted.sort(
        (a, b) => statusRank[a.status] - statusRank[b.status] || a.name.localeCompare(b.name),
      );
    case "featured":
    default:
      return sorted.sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          statusRank[a.status] - statusRank[b.status] ||
          stageRank[a.stage] - stageRank[b.stage] ||
          a.name.localeCompare(b.name),
      );
  }
}

export function filterTools(list: Tool[], filters: ToolFilterState): Tool[] {
  const filtered = list.filter((tool) => {
    if (!matchesQuery(tool, filters.query)) return false;
    if (
      filters.disciplines.length > 0 &&
      !filters.disciplines.some((id) => tool.disciplines.includes(id))
    ) {
      return false;
    }
    if (
      filters.software.length > 0 &&
      !filters.software.some((id) => tool.software.includes(id))
    ) {
      return false;
    }
    if (filters.statuses.length > 0 && !filters.statuses.includes(tool.status)) return false;
    return true;
  });
  return sortTools(filtered, filters.sort);
}

export function countBy<T extends string>(
  list: Tool[],
  accessor: (tool: Tool) => T[] | T,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const tool of list) {
    const value = accessor(tool);
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      counts[item] = (counts[item] ?? 0) + 1;
    }
  }
  return counts;
}

/* ------------------------------------------------------------------ */
/* Related tools                                                       */
/* ------------------------------------------------------------------ */

export function relatedTools(tool: Tool, limit = 4): Tool[] {
  return tools
    .filter((candidate) => candidate.id !== tool.id)
    .map((candidate) => {
      let score = 0;
      const sharedDisciplines = candidate.disciplines.filter((id) =>
        tool.disciplines.includes(id),
      ).length;
      score += sharedDisciplines * 3;
      if (candidate.group === tool.group) score += 2;
      if (candidate.stage === tool.stage) score += 2;
      score += candidate.software.filter((id) => tool.software.includes(id)).length;
      if (candidate.featured) score += 0.5;
      return { candidate, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name))
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

/**
 * The tool either side of this one in its discipline catalogue.
 *
 * Catalogue order is workflow order — the architecture line-up runs 1 to 20
 * from the incoming CAD set to the as-built drawings — so stepping through it
 * is stepping through the job.
 */
export function adjacentWorkflowTools(tool: Tool): { previous?: Tool; next?: Tool } {
  const sameDiscipline = toolsForDiscipline(tool.disciplines[0]);
  const index = sameDiscipline.findIndex((item) => item.id === tool.id);
  if (index === -1) return {};
  return {
    previous: sameDiscipline[index - 1],
    next: sameDiscipline[index + 1],
  };
}

/* ------------------------------------------------------------------ */
/* Counts for navigation                                               */
/* ------------------------------------------------------------------ */

export function disciplineCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const discipline of disciplines) {
    counts[discipline.id] = toolsForDiscipline(discipline.id).length;
  }
  return counts;
}

export function familyCount(id: DisciplineFamilyId): number {
  return toolsForFamily(id).length;
}

export function groupCount(disciplineId: DisciplineId, groupId: string): number {
  return toolsInGroup(disciplineId, groupId).length;
}

export { tools, disciplineMap };
export type { DisciplineId, SoftwareId, StageId };
