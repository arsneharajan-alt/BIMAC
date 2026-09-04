import type { Tool, ToolStatus } from "@/types";

/**
 * Shared plumbing for the catalogue.
 *
 * The catalogue is split one file per discipline under `data/catalogue/`,
 * because it now carries the full lifecycle for ten disciplines and a single
 * file would be unreviewable. Each file exports a `ToolSeed[]`; `data/tools.ts`
 * concatenates them and stamps status and video defaults through `t()`.
 */

/* ------------------------------------------------------------------ */
/* Availability                                                        */
/*                                                                     */
/* Move a tool between statuses by moving its id between these two sets.*/
/* Anything in neither set is "planned".                               */
/*   available      → shipping today, ready to demo                    */
/*   in-development → actively being built                             */
/*   planned        → on the roadmap, not started                      */
/* ------------------------------------------------------------------ */

export const AVAILABLE = new Set<string>([
  // Architecture — 9
  "ai-massing",
  "area-development-calculation",
  "ai-unit-mix-floor-planning",
  "ai-apartment-layouts",
  "rcp-generation",
  "architectural-annotation",
  "architectural-view-sheet",
  "architectural-schedule",
  "architectural-qaqc",
  // Structure — 5
  "structural-model-generation",
  "excel-driven-structural-modeling",
  "structural-annotation",
  "structural-view-sheet",
  "structural-quantity-takeoff",
  // HVAC — 3
  "hvac-modeling",
  "mechanical-equipment",
  "mechanical-documentation",
  // Electrical — 4
  "lighting-layout",
  "cable-tray-containment",
  "electrical-annotation",
  "electrical-documentation",
  // Plumbing — 2
  "plumbing-fixture",
  "plumbing-annotation",
  // Fire Fighting — 2
  "sprinkler-layout",
  "fire-fighting-annotation",
  // BIM & Revit — 11
  "cad-to-revit",
  "project-setup",
  "parameter-management",
  "view-template-automation",
  "excel-driven-bim",
  "schedule-data-automation",
  "quantity-takeoff-automation",
  "multi-format-export",
  "navisworks-export",
  "ifc-export",
  "deliverable-automation",
]);

export const IN_DEVELOPMENT = new Set<string>([
  // Architecture
  "excel-driven-architectural-modeling",
  "rcp-detailing",
  "interior-detailing",
  "callout-detail-automation",
  // Structure
  "structural-detail-automation",
  "structural-schedule",
  // MEPF
  "duct-routing",
  "mechanical-annotation",
  "electrical-modeling",
  "power-layout",
  "plumbing-modeling",
  "pipe-routing",
  "fire-fighting-modeling",
  // BIM & Revit
  "workset-management",
  "revit-model-cleanup",
]);

function resolveStatus(id: string): ToolStatus {
  if (AVAILABLE.has(id)) return "available";
  if (IN_DEVELOPMENT.has(id)) return "in-development";
  return "planned";
}

export type ToolSeed = Omit<Tool, "status" | "video"> &
  Partial<Pick<Tool, "status" | "video">>;

export function t(seed: ToolSeed): Tool {
  return {
    ...seed,
    status: seed.status ?? resolveStatus(seed.id),
    // No demos recorded yet — the tool page falls back to the interface preview.
    video: seed.video ?? { kind: "none" },
  };
}
