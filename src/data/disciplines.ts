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
    tagline: "From the first site study to as-built handover.",
    description:
      "Architectural production is where the largest share of avoidable hours sits — massing studies redrawn by hand, unit mixes recalculated in spreadsheets, ceiling plans rebuilt sheet by sheet, and annotation placed one tag at a time. These tools follow the architectural workflow in order, from site constraints through concept, schematic and detailed design, into a coordinated drawing package, and out the other side as a verified as-built model.",
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
  /* MEPF — seven services, each with the same lifecycle                */
  /* ================================================================== */
  {
    id: "hvac",
    slug: "hvac",
    name: "HVAC",
    shortName: "HVAC",
    family: "mepf",
    audience: "Mechanical and HVAC engineers and modellers",
    tagline: "Load calculation, ductwork, and the mechanical package.",
    description:
      "Mechanical design runs from a load calculation nobody wants to redo, through routing and equipment placement, into a package dominated by the sheer count of tags and schedules. These tools calculate the load, select and place the equipment, generate and size the duct and pipe runs, and produce the annotation, schedules, and sheets that follow.",
    glyph: "wind",
    groups: [
      {
        id: "concept-design",
        name: "Concept & Calculation",
        description: "Concept design, load calculation, and system selection.",
      },
      {
        id: "layout-modeling",
        name: "Layout & Modeling",
        description:
          "Equipment placement, duct and pipe layout, routing and sizing, and air terminal placement.",
      },
      {
        id: "documentation",
        name: "Documentation",
        description: "Dimensioning, tagging, detailing, schedules, and sheet generation.",
      },
      {
        id: "coordination",
        name: "Coordination & QA/QC",
        description: "Clash detection against every other service, and rule-based model checking.",
      },
      {
        id: "construction",
        name: "Construction",
        description: "Coordinated mechanical shop drawings issued to site and fabricator.",
      },
      {
        id: "as-built",
        name: "As-Built",
        description: "The installed mechanical condition captured and reconciled against design.",
      },
    ],
  },

  {
    id: "electrical",
    slug: "electrical",
    name: "Electrical",
    shortName: "Electrical",
    family: "mepf",
    audience: "Electrical engineers and modellers",
    tagline: "Load, distribution, containment, and the electrical package.",
    description:
      "Electrical layouts are rule-driven — spacing, coverage, circuiting, containment routes — which means they can be generated rather than placed by hand. These tools calculate the load, distribute it, place boards and devices, circuit and route them, and produce the single-line diagram, schedules, and drawings that follow.",
    glyph: "zap",
    groups: [
      {
        id: "concept-design",
        name: "Concept & Calculation",
        description: "Concept design, load calculation, and power distribution strategy.",
      },
      {
        id: "layout-modeling",
        name: "Layout & Modeling",
        description:
          "Panel and equipment placement, circuiting, cable and containment routing, lighting and small power.",
      },
      {
        id: "documentation",
        name: "Documentation",
        description:
          "Dimensioning, tagging, detailing, schedules, single-line diagram, and sheet generation.",
      },
      {
        id: "coordination",
        name: "Coordination & QA/QC",
        description: "Clash detection and rule-based checking of circuits, devices, and data.",
      },
      {
        id: "construction",
        name: "Construction",
        description: "Coordinated electrical shop drawings issued to site.",
      },
      {
        id: "as-built",
        name: "As-Built",
        description: "The installed electrical condition captured and reconciled against design.",
      },
    ],
  },

  {
    id: "plumbing",
    slug: "plumbing",
    name: "Plumbing & Public Health",
    shortName: "Plumbing",
    family: "mepf",
    audience: "Public health engineers and plumbing modellers",
    tagline: "Demand, fixtures, gravity drainage, and the plumbing package.",
    description:
      "Plumbing design means fixtures placed against architectural layouts and pipework routed between them under gradient and clearance rules that no other service has to respect. These tools calculate demand, place fixtures and equipment, route supply, drainage and stormwater with slope maintained, and produce the package.",
    glyph: "droplet",
    groups: [
      {
        id: "concept-design",
        name: "Concept & Calculation",
        description: "Concept design and water demand calculation across the systems.",
      },
      {
        id: "layout-modeling",
        name: "Layout & Modeling",
        description:
          "Domestic water, hot and cold, sanitary drainage, stormwater, fixtures, routing, sizing, and slope.",
      },
      {
        id: "documentation",
        name: "Documentation",
        description: "Dimensioning, tagging, detailing, schedules, and sheet generation.",
      },
      {
        id: "coordination",
        name: "Coordination & QA/QC",
        description:
          "Clash detection and rule-based checking of systems, gradients, and connectivity.",
      },
      {
        id: "construction",
        name: "Construction",
        description: "Coordinated plumbing shop drawings issued to site.",
      },
      {
        id: "as-built",
        name: "As-Built",
        description: "The installed plumbing condition captured and reconciled against design.",
      },
    ],
  },

  {
    id: "fire-fighting",
    slug: "fire-fighting",
    name: "Fire Fighting",
    shortName: "Fire Fighting",
    family: "mepf",
    audience: "Fire protection engineers and modellers",
    tagline: "Sprinkler coverage, fire pipework, and the fire package.",
    description:
      "Sprinkler design is the most rule-bound layout task in MEPF — coverage areas, spacing limits, obstruction rules — and therefore the most automatable. These tools size the fire demand, place pumps and tanks, generate compliant sprinkler and hydrant layouts, route and size the pipework, and produce the drawings and schedules.",
    glyph: "flame",
    groups: [
      {
        id: "concept-design",
        name: "Concept & Calculation",
        description: "Concept design and fire demand calculation for the protected areas.",
      },
      {
        id: "layout-modeling",
        name: "Layout & Modeling",
        description:
          "Pump and tank placement, sprinkler layout and spacing, hydrants and hose reels, pipe routing and sizing.",
      },
      {
        id: "documentation",
        name: "Documentation",
        description: "Dimensioning, tagging, detailing, schedules, and sheet generation.",
      },
      {
        id: "coordination",
        name: "Coordination & QA/QC",
        description: "Clash detection and rule-based checking of coverage, spacing, and connectivity.",
      },
      {
        id: "construction",
        name: "Construction",
        description: "Coordinated fire protection shop drawings issued to site.",
      },
      {
        id: "as-built",
        name: "As-Built",
        description: "The installed fire protection condition captured and reconciled against design.",
      },
    ],
  },

  {
    id: "fire-alarm",
    slug: "fire-alarm",
    name: "Fire Alarm",
    shortName: "Fire Alarm",
    family: "mepf",
    audience: "Fire alarm and life safety engineers and modellers",
    tagline: "Detection coverage, loops, addressing, and cause & effect.",
    description:
      "Fire alarm design is coverage rules followed by bookkeeping: detectors spaced to the code, call points on every escape route, sounders meeting an audibility target, then every device assigned to a loop, addressed, cabled, scheduled, and written into a cause and effect matrix. All of it is derivable from the model, and almost none of it is generated on a typical project.",
    glyph: "shield-check",
    groups: [
      {
        id: "concept-design",
        name: "Concept Design",
        description: "Detection strategy, system architecture, and zoning for the building.",
      },
      {
        id: "layout-modeling",
        name: "Layout & Modeling",
        description:
          "Detector, call point, sounder and strobe layouts, loop generation, addressing, and cable routing.",
      },
      {
        id: "documentation",
        name: "Documentation",
        description:
          "Dimensioning, tagging, detailing, device schedules, cause and effect, and sheet generation.",
      },
      {
        id: "coordination",
        name: "Coordination & QA/QC",
        description: "Coordination with every service, and rule-based checking of coverage and loops.",
      },
      {
        id: "as-built",
        name: "As-Built",
        description: "The installed and commissioned alarm system captured as a model of record.",
      },
    ],
  },

  {
    id: "elv-ict",
    slug: "elv-ict",
    name: "ELV / ICT",
    shortName: "ELV / ICT",
    family: "mepf",
    audience: "ELV, ICT, and security systems engineers and modellers",
    tagline: "CCTV, access control, data, Wi-Fi, PA, and structured cabling.",
    description:
      "ELV is seven small disciplines wearing one hat — CCTV, access control, data and telecom, Wi-Fi, intercom, public address, structured cabling — each with its own coverage rule and each usually drawn by hand. These tools generate the device layouts to their coverage rules, route the containment and cabling back to the racks, and produce one coherent package.",
    glyph: "globe",
    groups: [
      {
        id: "concept-design",
        name: "Concept Design",
        description: "System architecture and coverage strategy across the ELV and ICT services.",
      },
      {
        id: "layout-modeling",
        name: "Layout & Modeling",
        description:
          "CCTV, access control, data and telecom, Wi-Fi, intercom, PA, structured cabling, and routing.",
      },
      {
        id: "documentation",
        name: "Documentation",
        description: "Dimensioning, tagging, detailing, schedules, and sheet generation.",
      },
      {
        id: "coordination",
        name: "Coordination & QA/QC",
        description: "Coordination with every service, and rule-based checking of devices and data.",
      },
      {
        id: "as-built",
        name: "As-Built",
        description: "The installed ELV and ICT condition captured as a model of record.",
      },
    ],
  },

  {
    id: "bms",
    slug: "bms",
    name: "BMS & Controls",
    shortName: "BMS",
    family: "mepf",
    audience: "Controls engineers, commissioning managers, and BMS integrators",
    tagline: "Controls architecture, points, schematics, and commissioning.",
    description:
      "Controls is the service that binds every other one, and the one most often documented last and worst. These tools set the controls architecture, place sensors and controllers, generate the point list from the equipment that is actually in the model, produce the control schematics and point schedules, and carry that structure through testing and commissioning into handover data.",
    glyph: "sliders",
    groups: [
      {
        id: "concept-design",
        name: "Concept & Architecture",
        description: "Controls concept and the system architecture the points hang off.",
      },
      {
        id: "layout-modeling",
        name: "Layout & Points",
        description:
          "Sensor and controller placement, point generation, equipment and HVAC controls, electrical monitoring, metering.",
      },
      {
        id: "documentation",
        name: "Documentation",
        description: "Tagging, control schematics, point schedules, and the controls package.",
      },
      {
        id: "coordination",
        name: "Coordination & QA/QC",
        description: "Coordination against every serviced system, and point list validation.",
      },
      {
        id: "commissioning",
        name: "Testing & Commissioning",
        description: "Commissioning records tracked against the point list rather than a spreadsheet.",
      },
      {
        id: "as-built",
        name: "As-Built",
        description: "Commissioned point data and controls record issued as structured handover.",
      },
    ],
  },

  /* ================================================================== */
  /* CROSS-DISCIPLINE                                                   */
  /* ================================================================== */
  {
    id: "bim-revit",
    slug: "bim-revit",
    name: "BIM & Revit Automation",
    shortName: "BIM & Revit",
    family: "bim-revit",
    audience: "BIM managers, coordinators, and digital delivery leads",
    tagline: "Tools every discipline uses, kept in one place instead of duplicated.",
    description:
      "Some work belongs to no single discipline: setting a project up, governing parameters, cleaning a model, coordinating links, exporting a package, closing out a handover. Putting these here means an architect and an HVAC engineer find the same tool in the same place, and the catalogue stays honest about what is actually one product.",
    glyph: "layers",
    groups: [
      {
        id: "project-model-management",
        name: "Project & Model Management",
        description:
          "Set projects up, govern parameters and worksets, keep models clean and links coordinated.",
      },
      {
        id: "conversion",
        name: "BIM Conversion",
        description: "CAD and point cloud into a modelled, data-complete Revit project.",
      },
      {
        id: "data-documentation",
        name: "Data & Documentation",
        description: "Spreadsheet-driven automation, schedules, quantities, and cost.",
      },
      {
        id: "coordination",
        name: "Coordination",
        description: "Federated model coordination and rule-based quality control.",
      },
      {
        id: "export",
        name: "Export & Deliverables",
        description: "Multi-format export, publishing, and repeatable issue packages.",
      },
      {
        id: "completion",
        name: "Project Completion",
        description: "As-built capture and structured handover.",
      },
    ],
    faqs: [
      {
        question: "Why are CAD-to-Revit and Scan-to-BIM listed here rather than per discipline?",
        answer:
          "Because they are one product each, not ten. Both carry discipline badges and appear on every relevant discipline page, but there is a single page, a single version, and a single demo — so you are never comparing ten near-identical listings to work out which one you need.",
      },
      {
        question: "Do these tools require a specific Revit version?",
        answer:
          "Each tool page lists the Revit releases it is built against. Support for a new release normally follows within a few weeks of it shipping.",
      },
    ],
  },
];

/** The four top-level families shown in navigation. MEPF collects its seven services. */
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
    id: "mepf",
    name: "MEPF",
    shortName: "MEPF",
    slug: "mepf",
    tagline: "HVAC, Electrical, Plumbing, Fire Fighting, Fire Alarm, ELV/ICT, BMS",
    glyph: "wind",
    members: [
      "hvac",
      "electrical",
      "plumbing",
      "fire-fighting",
      "fire-alarm",
      "elv-ict",
      "bms",
    ],
  },
  {
    id: "bim-revit",
    name: "BIM & Revit Automation",
    shortName: "BIM & Revit",
    slug: "bim-revit",
    tagline: "Setup, data, model management, coordination, export, handover",
    glyph: "layers",
    members: ["bim-revit"],
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
