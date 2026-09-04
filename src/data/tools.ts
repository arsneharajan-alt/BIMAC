import type { Tool } from "@/types";
import { t, type ToolSeed } from "./catalogue/shared";
import { architectureTools } from "./catalogue/architecture";
import { structureTools } from "./catalogue/structure";
import { hvacTools } from "./catalogue/hvac";
import { electricalTools } from "./catalogue/electrical";
import { plumbingTools } from "./catalogue/plumbing";
import { fireFightingTools } from "./catalogue/fire-fighting";
import { fireAlarmTools } from "./catalogue/fire-alarm";
import { elvIctTools } from "./catalogue/elv-ict";
import { bmsTools } from "./catalogue/bms";
import { bimRevitTools } from "./catalogue/bim-revit";

/**
 * The BIMAC tool catalogue.
 *
 * Adding a tool means adding one object to the relevant file under
 * `data/catalogue/`. It will appear in the catalogue, its discipline hub, its
 * stage page, search, and its own detail page at /tools/{discipline}/{slug}
 * with no page changes.
 *
 * Order matters only for readability — every surface sorts for itself. The
 * files are listed in lifecycle order within each discipline so the catalogue
 * reads the way a project runs.
 */

const seeds: ToolSeed[] = [
  ...bimRevitTools,
  ...architectureTools,
  ...structureTools,
  ...hvacTools,
  ...electricalTools,
  ...plumbingTools,
  ...fireFightingTools,
  ...fireAlarmTools,
  ...elvIctTools,
  ...bmsTools,
];

export const tools: Tool[] = seeds.map(t);

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
