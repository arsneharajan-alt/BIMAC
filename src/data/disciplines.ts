import type {
  Discipline,
  DisciplineFamily,
  DisciplineFamilyId,
  DisciplineId,
} from "@/types";

/**
 * The primary navigation axis.
 *
 * A visitor identifies as an architect, a structural engineer, or an HVAC
 * engineer. They should never have to know which host application a plugin
 * loads into in order to find it.
 *
 * Each discipline's `groups` are its own lifecycle, in project order, and every
 * group id matches the stage the tools inside it belong to. That is what makes
 * the hub read top to bottom the way a project actually runs — site study to
 * as-built handover — instead of as an alphabetised pile.
 */

export const disciplines: Discipline[] = [
  /* ================================================================== */
  /* ARCHITECTURE                                                       */
  /* ================================================================== */
  {
    id: "architecture",
    slug: "architecture",
    name: "Architecture",
    shortName: "Architecture",
    family: "architecture",
    audience: "Architects, architectural technologists, and interior designers",
    tagline: "From Site Study to As-Built Handover.",
    description:
      "Automate BIM workflows from Site Study to as built Handover, reducing manual effort, improving accuracy, and accelerating project delivery.",
    glyph: "home",
    groups: [
      {
        id: "site-feasibility",
        name: "Site & Feasibility",
        description:
          "Constraints, massing envelope, solar behaviour, and orientation established before the design starts.",
      },
      {
        id: "concept-design",
        name: "Concept Design",
        description:
          "Generate and compare options before a single wall is modelled — massing, program, form, and area.",
      },
      {
        id: "schematic-design",
        name: "Schematic Design",
        description:
          "Floor plans, rooms, cores, circulation, openings, and facade concept fixed as a coherent arrangement.",
      },
      {
        id: "detailed-design",
        name: "Detailed Design",
        description:
          "The full architectural model — walls, floors, ceilings, facades, stairs, interiors, and finishes.",
      },
      {
        id: "documentation",
        name: "Documentation",
        description:
          "Plans, elevations, sections, details, annotation, sheets, and schedules produced as a package.",
      },
      {
        id: "coordination",
        name: "Coordination & QA/QC",
        description:
          "Check the model against your standard, coordinate with every other discipline, resolve clashes.",
      },
      {
        id: "construction",
        name: "Construction",
        description:
          "Construction documentation, shop drawings, change tracking, and progress updates from site.",
      },
      {
        id: "as-built",
        name: "As-Built",
        description:
          "Scan-to-BIM, field verification, as-built drawings, and the structured handover deliverable.",
      },
    ],
    faqs: [
      {
        question: "Do the concept tools need Revit?",
        answer:
          "The massing, program, and layout generators run standalone so you can explore options before committing to a Revit model. Output imports into Revit as native geometry when you are ready to take an option forward.",
      },
      {
        question: "Will these work with our office template?",
        answer:
          "Yes. The documentation and annotation tools read whatever titleblocks, tags, and view templates are already loaded in the project. Nothing requires adopting BIMAC content.",
      },
      {
        question: "Can we start at detailed design rather than concept?",
        answer:
          "Every stage stands alone. Most practices adopt one stage first — usually documentation or detailed design, because that is where the overtime is — and extend backwards into concept later.",
      },
    ],
  },

  /* ================================================================== */
  /* STRUCTURE                                                          */
  /* ================================================================== */
  {
    id: "structure",
    slug: "structure",
    name: "Structure",
    shortName: "Structure",
    family: "structure",
    audience: "Structural engineers, structural technicians, and BIM modellers",
    tagline: "Concept framing to as-built, with the analysis loop closed.",
    description:
      "Structural modelling is highly repetitive and highly rule-bound, which makes it unusually well suited to automation. These tools generate the grid and framing, design members and reinforcement, drive the analysis and code-checking loop against the model rather than a parallel spreadsheet, produce the drawing package, and carry the result through fabrication into a verified as-built record.",
    glyph: "frame",
    groups: [
      {
        id: "concept-design",
        name: "Concept Design",
        description:
          "Structural system selection, grid optimisation, and preliminary sizing before modelling starts.",
      },
      {
        id: "schematic-design",
        name: "Schematic Design",
        description:
          "Columns, beams, slabs, cores, shear walls, and foundation concept laid out against the grid.",
      },
      {
        id: "detailed-design",
        name: "Detailed Design",
        description:
          "The full structural model — concrete and steel member design, foundations, connections, and rebar.",
      },
      {
        id: "analysis",
        name: "Analysis & Optimization",
        description:
          "Loads, analysis, member optimisation, performance checks, and code compliance run against the model.",
      },
      {
        id: "documentation",
        name: "Documentation",
        description:
          "Framing plans, foundation plans, sections, details, rebar drawings, and structural schedules.",
      },
      {
        id: "coordination",
        name: "Coordination & QA/QC",
        description:
          "Structural clash detection, architectural and MEP coordination, and model quality control.",
      },
      {
        id: "construction",
        name: "Construction",
        description:
          "Structural and rebar shop drawings, fabrication data, change tracking, and progress tracking.",
      },
      {
        id: "as-built",
        name: "As-Built",
        description:
          "Scan-to-BIM, field verification, as-built model and drawings, and structural handover data.",
      },
    ],
    faqs: [
      {
        question: "Can the model generator work from our CAD grid drawings?",
        answer:
          "Yes. Grid lines, column positions, and beam layouts are read from the DWG and mapped to Revit families you nominate. You review the mapping before anything is placed.",
      },
      {
        question: "Which analysis packages do the analysis tools talk to?",
        answer:
          "The loading, optimisation, and code-check tools exchange with the common structural analysis packages through their published formats, so the model and the analysis stay in step rather than diverging after the first revision.",
      },
      {
        question: "Do quantities follow a measurement standard?",
        answer:
          "Extraction is rule-based and the rules are yours to define, so the output can be aligned to whichever measurement standard your contract uses.",
      },
    ],
  },

  /* ================================================================== */
  /* ================================================================== */
  /* MEP — one product line, not seven service catalogues               */
  /* ================================================================== */
  {
    id: "mep",
    slug: "mep",
    name: "MEP",
    shortName: "MEP",
    family: "mep",
    audience: "Mechanical, electrical, plumbing and fire engineers and modellers",
    tagline: "From CAD conversion to as-built handover.",
    description:
      "Automate BIM workflows from CAD conversion to as-built handover, reducing manual effort, improving accuracy, and accelerating project delivery.",
    glyph: "wind",
    groups: [
      {
        id: "modelling",
        name: "Modelling",
        description:
          "Services modelled from the drawing, the scan or the grid, with the equipment and supports that go with them.",
      },
      {
        id: "design",
        name: "Design",
        description:
          "Loads, flows, routes and sizes — the calculations the layout has to satisfy, run against the model rather than beside it.",
      },
      {
        id: "coordination",
        name: "Coordination",
        description:
          "Builders work, clash detection and the data layer that keeps a federated model consistent.",
      },
      {
        id: "documentation",
        name: "Documentation",
        description:
          "Dimensions, tags, schedules, sheets and the drawing packages that come off the model.",
      },
    ],
  },
];

/** The three top-level families shown in navigation — one per card folder. */
export const disciplineFamilies: DisciplineFamily[] = [
  {
    id: "architecture",
    name: "Architecture",
    shortName: "Architecture",
    slug: "architecture",
    tagline: "Site, concept, schematic, detailed, documentation, coordination, construction, as-built",
    glyph: "home",
    members: ["architecture"],
  },
  {
    id: "structure",
    name: "Structure",
    shortName: "Structure",
    slug: "structure",
    tagline: "Concept, schematic, detailed, analysis, documentation, coordination, construction, as-built",
    glyph: "frame",
    members: ["structure"],
  },
  {
    id: "mep",
    name: "MEP",
    shortName: "MEP",
    slug: "mep",
    tagline: "Mechanical, electrical, plumbing, fire fighting and fire alarm",
    glyph: "wind",
    members: ["mep"],
  },
];

export const disciplineMap: Record<DisciplineId, Discipline> = disciplines.reduce(
  (acc, discipline) => {
    acc[discipline.id] = discipline;
    return acc;
  },
  {} as Record<DisciplineId, Discipline>,
);

export function getDiscipline(id: DisciplineId): Discipline {
  return disciplineMap[id];
}

export function findDisciplineBySlug(slug: string): Discipline | undefined {
  return disciplines.find((discipline) => discipline.slug === slug);
}

export function findFamilyBySlug(slug: string): DisciplineFamily | undefined {
  return disciplineFamilies.find((family) => family.slug === slug);
}

export function getFamily(id: DisciplineFamilyId): DisciplineFamily {
  return disciplineFamilies.find((family) => family.id === id) as DisciplineFamily;
}

/** Group lookup within a discipline, for card badges and hub sections. */
export function getGroup(disciplineId: DisciplineId, groupId: string) {
  return disciplineMap[disciplineId]?.groups.find((group) => group.id === groupId);
}
