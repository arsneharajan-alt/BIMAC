import { disciplines } from "@/data/disciplines";
import { softwarePlatforms } from "@/data/software";
import { toolHref, tools } from "@/data/tools";
import type { SoftwareId, SoftwarePlatform, ToolStatus } from "@/types";

/**
 * Resolving a software platform into something a page can render.
 *
 * Two kinds of platform live in `data/software.ts`:
 *
 *   fromCatalogue  — Revit. Its groups are derived from the live catalogue, so
 *                    the page can never drift from the tools themselves. Every
 *                    entry links to its tool page.
 *   authored       — everything else. A capability list written by hand. An
 *                    entry links out only when a catalogue tool already carries
 *                    that exact name; the rest are scope, not shipped plugins.
 */

export interface SoftwareCapabilityView {
  name: string;
  /** Present when this capability ships as a listed catalogue tool. */
  href?: string;
  status?: ToolStatus;
}

export interface SoftwareGroupView {
  id: string;
  name: string;
  description?: string;
  /** Present when the group maps onto a discipline hub. */
  href?: string;
  capabilities: SoftwareCapabilityView[];
}

/** Loose match so "Automated Dimensioning" finds a tool named the same way. */
function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const toolsByName = new Map(tools.map((tool) => [normalise(tool.name), tool]));

function resolve(name: string): SoftwareCapabilityView {
  const tool = toolsByName.get(normalise(name));
  return tool ? { name, href: toolHref(tool), status: tool.status } : { name };
}

/**
 * Revit's groups, built from the catalogue and keyed on each tool's canonical
 * discipline so a multi-discipline tool is listed once, where it belongs.
 */
function catalogueGroups(platformId: SoftwareId): SoftwareGroupView[] {
  return disciplines
    .map((discipline) => {
      const owned = tools.filter(
        (tool) =>
          tool.disciplines[0] === discipline.id && tool.software.includes(platformId),
      );
      return {
        id: discipline.slug,
        name: discipline.name,
        description: discipline.tagline,
        href: `/tools/${discipline.slug}`,
        capabilities: owned.map((tool) => ({
          name: tool.name,
          href: toolHref(tool),
          status: tool.status,
        })),
      };
    })
    .filter((group) => group.capabilities.length > 0);
}

export function groupsFor(platform: SoftwarePlatform): SoftwareGroupView[] {
  if (platform.fromCatalogue) return catalogueGroups(platform.id);
  return platform.groups.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    capabilities: group.capabilities.map(resolve),
  }));
}

/** How many automations a platform covers — used on the cards and the header. */
export function capabilityCount(platform: SoftwarePlatform): number {
  return groupsFor(platform).reduce((total, group) => total + group.capabilities.length, 0);
}

/** Every capability across every platform. */
export function totalCapabilities(): number {
  return softwarePlatforms.reduce((total, platform) => total + capabilityCount(platform), 0);
}

/** A few group names, for the summary line on a platform card. */
export function groupNames(platform: SoftwarePlatform, limit = 4): string[] {
  return groupsFor(platform)
    .slice(0, limit)
    .map((group) => group.name);
}
