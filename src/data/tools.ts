import type { Tool } from "@/types";
import { t, type ToolSeed } from "./catalogue/shared";
import { architectureTools } from "./catalogue/architecture";
import { structureTools } from "./catalogue/structure";
import { mepTools } from "./catalogue/mep";

/**
 * The BIMAC tool catalogue.
 *
 * Adding a tool means adding one object to the relevant file under
 * `data/catalogue/`. It will appear in the catalogue, its discipline hub,
 * search, and its own detail page at /tools/{discipline}/{slug} with no page
 * changes.
 *
 * Order matters only for readability — every surface sorts for itself. The
 * files are listed in lifecycle order within each discipline so the catalogue
 * reads the way a project runs.
 */

const seeds: ToolSeed[] = [
  ...architectureTools,
  ...structureTools,
  ...mepTools,
];

export const tools: Tool[] = seeds.map(t);

/** Tools by id, for line-ups that name their cards explicitly. */
export const toolMap: Record<string, Tool> = tools.reduce<Record<string, Tool>>(
  (acc, tool) => {
    acc[tool.id] = tool;
    return acc;
  },
  {},
);

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

/** Canonical URL — always the tool's first discipline. */
export function toolHref(tool: Tool): string {
  return `/tools/${tool.disciplines[0]}/${tool.slug}`;
}

export function getToolByPath(disciplineSlug: string, toolSlug: string): Tool | undefined {
  return tools.find(
    (tool) => tool.disciplines[0] === disciplineSlug && tool.slug === toolSlug,
  );
}
