import type { Software, SoftwareId, Stage, StageId } from "@/types";

/**
 * The lifecycle axis. BIMAC's tools are built stage by stage, from the first
 * concept study through to as-built handover, so the site says so explicitly.
 */
export const stages: Stage[] = [
  {
    id: "feasibility",
    slug: "site-feasibility",
    name: "Site & Feasibility",
    lod: "LOD 100",
    tagline: "Understand the site before you design against it.",
    description:
      "Constraints, envelope, orientation, and solar behaviour established from survey and planning data. The stage that decides how much of the brief the site can actually take, usually settled on assumptions that were never tested.",
    glyph: "map-pin",
  },
  {
    id: "concept",
    slug: "concept",
    name: "Concept Design",
    lod: "LOD 100–200",
    tagline: "Test options before committing to a model.",
    description:
      "The stage where decisions are cheapest and least often tested properly. Massing, area and development calculations, system selection, and layout options generated in minutes rather than days, so the option taken forward is the one that actually performed best.",
    glyph: "sparkles",
  },
  {
    id: "schematic",
    slug: "schematic",
    name: "Schematic Design",
    lod: "LOD 200",
    tagline: "Fix the arrangement — grids, cores, layouts, routes.",
    description:
      "The design becomes specific: floor plans, structural grids, primary routes, and equipment positions. Rule-bound arrangement work that is still redrawn by hand on most projects every time the concept shifts.",
    glyph: "grid",
  },
  {
    id: "detailed",
    slug: "detailed",
    name: "Detailed Design",
    lod: "LOD 300–350",
    tagline: "Build the model, don't draw it twice.",
    description:
      "Full modelling of the discipline — elements, systems, sizes, and connections, with the parameter data already correct. The largest single block of production time on most projects and the one most amenable to automation.",
    glyph: "cube",
  },
  {
    id: "analysis",
    slug: "analysis",
    name: "Analysis & Optimization",
    lod: "LOD 300",
    tagline: "Size it against the load, then check it against the code.",
    description:
      "Loads, demands, and performance run against the model rather than a parallel spreadsheet, with member and system sizing optimised and code compliance checked before the drawings are produced.",
    glyph: "calculator",
  },
  {
    id: "documentation",
    slug: "documentation",
    name: "Documentation",
    lod: "LOD 350",
    tagline: "Produce the package, don't assemble it.",
    description:
      "Dimensions, tags, details, schedules, views, and sheets created as a set from a drawing register, with titleblock data populated and revisions applied across the whole package at once.",
    glyph: "file-text",
  },
  {
    id: "coordination",
    slug: "coordination",
    name: "Coordination & QA/QC",
    lod: "LOD 350–400",
    tagline: "Catch it in the model, not on site.",
    description:
      "Rule-based checking of models and drawings against your standard, federated multi-discipline coordination, and clash results that can be compared between revisions rather than argued about.",
    glyph: "shield-check",
  },
  {
    id: "construction",
    slug: "construction",
    name: "Construction",
    lod: "LOD 400",
    tagline: "Issue what the site and the fabricator actually need.",
    description:
      "Shop drawings, fabrication data, quantities, change tracking, and progress updates — the stage where the model stops being a design record and starts being a construction instrument.",
    glyph: "package",
  },
  {
    id: "as-built",
    slug: "as-built",
    name: "As-Built & Handover",
    lod: "LOD 500",
    tagline: "Close the project out properly.",
    description:
      "Capturing the constructed condition from scan and field record, reconciling it against the design model, completing asset data against the client's requirements, and producing the structured handover deliverable rather than a folder of PDFs.",
    glyph: "check-circle",
  },
];

export const stageMap: Record<StageId, Stage> = stages.reduce(
  (acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  },
  {} as Record<StageId, Stage>,
);

export function getStage(id: StageId): Stage {
  return stageMap[id];
}

export function findStageBySlug(slug: string): Stage | undefined {
  return stages.find((stage) => stage.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Host software — a filter, not the hierarchy                         */
/* ------------------------------------------------------------------ */

export const softwareList: Software[] = [
  { id: "revit", name: "Autodesk Revit", shortName: "Revit", glyph: "cube" },
  { id: "autocad", name: "Autodesk AutoCAD", shortName: "AutoCAD", glyph: "ruler" },
  { id: "navisworks", name: "Autodesk Navisworks", shortName: "Navisworks", glyph: "layers" },
  { id: "excel", name: "Microsoft Excel", shortName: "Excel", glyph: "database" },
  { id: "power-bi", name: "Microsoft Power BI", shortName: "Power BI", glyph: "bar-chart" },
  { id: "primavera", name: "Oracle Primavera P6", shortName: "Primavera P6", glyph: "gantt" },
  { id: "etabs", name: "CSI ETABS", shortName: "ETABS", glyph: "frame" },
  { id: "ms-project", name: "Microsoft Project", shortName: "MS Project", glyph: "calendar" },
  { id: "standalone", name: "Standalone application", shortName: "Standalone", glyph: "package" },
];

export const softwareMap: Record<SoftwareId, Software> = softwareList.reduce(
  (acc, software) => {
    acc[software.id] = software;
    return acc;
  },
  {} as Record<SoftwareId, Software>,
);

export function getSoftware(id: SoftwareId): Software {
  return softwareMap[id];
}
