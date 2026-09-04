import { disciplineMap, disciplines, getFamily } from "@/data/disciplines";
import { stages } from "@/data/stages";
import { tools } from "@/data/tools";
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
  { id: "stage", label: "Project stage" },
  { id: "status", label: "Availability" },
  { id: "az", label: "A–Z" },
];

export const emptyFilters: ToolFilterState = {
  query: "",
  disciplines: [],
  stages: [],
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

/** Every tool across a family — MEPF returns all seven services disciplines. */
export function toolsForFamily(id: DisciplineFamilyId): Tool[] {
  const members = getFamily(id).members;
  return tools.filter((tool) =>
    tool.disciplines.some((discipline) => members.includes(discipline)),
  );
}

export function toolsForStage(id: StageId): Tool[] {
  return tools.filter((tool) => tool.stage === id);
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
    case "stage":
      return sorted.sort(
        (a, b) => stageRank[a.stage] - stageRank[b.stage] || a.name.localeCompare(b.name),
      );
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
    if (filters.stages.length > 0 && !filters.stages.includes(tool.stage)) return false;
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

/** The tool immediately before and after this one in the lifecycle. */
export function adjacentStageTools(tool: Tool): { previous?: Tool; next?: Tool } {
  const rank = stageRank[tool.stage];
  const sameDiscipline = toolsForDiscipline(tool.disciplines[0]);
  const previous = sortTools(
    sameDiscipline.filter((item) => stageRank[item.stage] < rank),
    "stage",
  ).pop();
  const next = sortTools(
    sameDiscipline.filter((item) => stageRank[item.stage] > rank),
    "stage",
  )[0];
  return { previous, next };
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
