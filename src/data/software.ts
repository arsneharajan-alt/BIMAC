import type { CrossPlatformFlow, SoftwareId, SoftwarePlatform } from "@/types";

/**
 * The software axis.
 *
 * Discipline remains the primary way into the catalogue — an architect should
 * never have to know which application a plugin loads into. But a visitor who
 * already runs AutoCAD, Navisworks or P6 arrives asking a different question:
 * "what can you automate in the software I have open right now?" This file
 * answers that, one platform at a time.
 *
 * Revit is marked `fromCatalogue` because its automation already ships as
 * listed tools; its groups are derived from the live catalogue in
 * `lib/software.ts` so the page can never drift from the tools themselves.
 * Every other platform carries an authored capability list.
 */

export const softwarePlatforms: SoftwarePlatform[] = [
  /* ================================================================== */
  /* REVIT — derived from the catalogue                                  */
  /* ================================================================== */
  {
    id: "revit",
    slug: "revit",
    name: "Autodesk Revit",
    shortName: "Revit",
    vendor: "Autodesk",
    glyph: "cube",
    logo: "/logos/revit.svg",
    mark: { letters: "R", color: "#0696D7" },
    role: "Modelling & documentation",
    tagline: "The model that everything else is generated from.",
    description:
      "Revit is where BIMAC's automation is deepest. Model generation, parameter and view management, annotation, sheets, schedules, quantity takeoff and export all run as listed plugins, grouped here by the discipline they serve.",
    fromCatalogue: true,
    groups: [],
  },

  /* ================================================================== */
  /* AUTOCAD                                                             */
  /* ================================================================== */
  {
    id: "autocad",
    slug: "autocad",
    name: "Autodesk AutoCAD",
    shortName: "AutoCAD",
    vendor: "Autodesk",
    glyph: "ruler",
    logo: "/logos/autocad.svg",
    mark: { letters: "A", color: "#D8261C" },
    role: "2D drawing production",
    tagline: "Drawing production without the redrawing.",
    description:
      "Most AutoCAD hours go into work that is fully determined by information already held somewhere — plans, elevations, sections, schedules, title blocks, revision clouds and submission packages. These routines generate that output from the source data and keep it consistent across the set.",
    groups: [
      {
        id: "architectural",
        name: "Architectural",
        description:
          "The architectural drawing set generated from the layout, then annotated and sheeted as a package.",
        capabilities: [
          "Automated Floor Plan Generator",
          "Automated Elevation Generator",
          "Automated Section Generator",
          "Automated Door & Window Schedule Generator",
          "Automated Room Layout Generator",
          "Automated Detail Drawing Generator",
          "Automated Architectural Sheet Generator",
          "Automated Annotation & Dimensioning",
          "Automated Area Calculation & Schedule",
          "Automated Drawing Index Generator",
        ],
      },
      {
        id: "structural",
        name: "Structural",
        description:
          "Framing, foundation and reinforcement drawings produced from the structural arrangement, with the schedules that go with them.",
        capabilities: [
          "Structural Plan Generator",
          "Column & Beam Drawing Generator",
          "Foundation Drawing Generator",
          "Reinforcement Detail Generator",
          "Structural Section Generator",
          "Structural Detail Generator",
          "Bar Bending Schedule Generator",
          "Structural Drawing QA/QC",
        ],
      },
      {
        id: "mep",
        name: "MEP",
        description:
          "Services drawings, schematics, risers and shop drawings across the four MEP trades.",
        capabilities: [
          "HVAC Drawing Generator",
          "Plumbing Drawing Generator",
          "Electrical Drawing Generator",
          "Fire Fighting Drawing Generator",
          "Single-Line Diagram Generator",
          "MEP Schematic Generator",
          "MEP Shop Drawing Generator",
          "MEP Riser Diagram Generator",
          "MEP Calculation-to-Drawing Generator",
        ],
      },
      {
        id: "general-cad",
        name: "General CAD Automation",
        description:
          "Discipline-agnostic housekeeping — sheets, title blocks, revisions, standards, layers, exports and submission packages.",
        capabilities: [
          "Automated Sheet Generator",
          "Automated Title Block Updater",
          "Automated PDF/DWG Exporter",
          "Batch Drawing Publisher",
          "Drawing Revision Generator",
          "Revision Cloud Generator",
          "CAD Standards Checker",
          "Drawing QA/QC Checker",
          "Layer Management Automation",
          "CAD Cleanup & Purge",
          "Automated Block Generation",
          "Automated Dimensioning",
          "Automated Annotation",
          "Automated Drawing Comparison",
          "Automated Drawing Index",
          "Automated Submission Package Generator",
        ],
      },
    ],
  },

  /* ================================================================== */
  /* NAVISWORKS                                                          */
  /* ================================================================== */
  {
    id: "navisworks",
    slug: "navisworks",
    name: "Autodesk Navisworks",
    shortName: "Navisworks",
    vendor: "Autodesk",
    glyph: "layers",
    mark: { letters: "N", color: "#0E9C8E" },
    role: "Coordination & clash",
    tagline: "Federate, clash, group, report — without the manual week.",
    description:
      "A coordination cycle is mostly repetition: reload the discipline models, re-run the same clash tests, deduplicate thousands of hits into the few dozen that matter, assign them, capture viewpoints, and rebuild the report. These routines run that cycle end to end and hand back the package.",
    groups: [
      {
        id: "model-coordination",
        name: "Model Coordination",
        description:
          "The federated model assembled, version-checked and validated before a single clash test runs.",
        capabilities: [
          "Automated Model Federation",
          "Discipline Model Loader",
          "Model Version Comparison",
          "Coordinate System Checker",
          "Missing Model Checker",
          "Model Naming Checker",
        ],
      },
      {
        id: "clash-detection",
        name: "Clash Detection",
        description:
          "Tests set up, run in batch, and reduced from raw hits to an assigned, prioritised, reportable list.",
        capabilities: [
          "Automated Clash Test Setup",
          "Batch Clash Detection",
          "Clash Grouping & Deduplication",
          "Clash Priority Classification",
          "Clash Assignment by Discipline",
          "Clash Status Management",
          "Clash Viewpoint Generator",
          "Clash Screenshot Generator",
          "Clash Report Generator",
        ],
      },
      {
        id: "mep-coordination",
        name: "MEP Coordination",
        description:
          "The service-by-service checks that decide whether the design can actually be installed.",
        capabilities: [
          "MEP vs Structural Clash Detection",
          "MEP vs Architectural Clash Detection",
          "MEP vs MEP Clash Detection",
          "Equipment Clearance Checker",
          "Maintenance Access Checker",
          "Ceiling Space Checker",
          "Shaft Coordination Checker",
          "Plant Room Coordination Checker",
          "Pipe & Duct Clearance Checker",
          "Structural Opening Checker",
        ],
      },
      {
        id: "constructability",
        name: "Constructability",
        description:
          "Whether it can be built, installed, reached and replaced once the building is occupied.",
        capabilities: [
          "Installation Sequence Review",
          "Equipment Installation Access Check",
          "Equipment Replacement Access Check",
          "Construction Zone Verification",
          "Temporary Works Coordination",
        ],
      },
      {
        id: "4d-progress",
        name: "4D & Progress",
        description:
          "The model linked to the programme, so planned and actual can be compared in the same view.",
        capabilities: [
          "Model-to-Schedule Linking",
          "4D Construction Simulation",
          "Planned vs Actual Progress",
          "Installation Progress Tracking",
        ],
      },
      {
        id: "data-quantities",
        name: "Data & Quantities",
        description:
          "Properties, quantities and asset data pulled out of the federated model into a usable register.",
        capabilities: [
          "Model Property Extraction",
          "Quantity Takeoff",
          "Equipment Register Generator",
          "Asset Data Export",
          "Excel/CSV Export",
          "Custom Report Generator",
        ],
      },
      {
        id: "qa-qc",
        name: "QA/QC",
        description:
          "Standards, completeness, duplication and revision checked before the model is issued.",
        capabilities: [
          "Model Standards Checker",
          "Property Completeness Checker",
          "Duplicate Element Checker",
          "Model Revision Checker",
          "Automated QA/QC Report",
        ],
      },
      {
        id: "publishing",
        name: "Publishing",
        description:
          "The coordination, clash, meeting and handover packages assembled and issued.",
        capabilities: [
          "Automated Coordination Package",
          "Automated Clash Package",
          "PDF Report Generator",
          "Coordination Meeting Package",
          "Handover Package Generator",
        ],
      },
    ],
  },

  /* ================================================================== */
  /* EXCEL                                                               */
  /* ================================================================== */
  {
    id: "excel",
    slug: "excel",
    name: "Microsoft Excel",
    shortName: "Excel",
    vendor: "Microsoft",
    glyph: "database",
    logo: "/logos/excel.svg",
    mark: { letters: "X", color: "#217346" },
    role: "Calculation & data",
    tagline: "The spreadsheet layer between the model and everything else.",
    description:
      "Excel is where engineering calculation, quantity, cost and tracking data actually live — and where the most fragile manual work happens. These routines generate the workbooks, validate what goes into them, and move data both ways between the spreadsheet and the CAD or BIM model.",
    groups: [
      {
        id: "calculation-quantities",
        name: "Calculation & Quantities",
        description:
          "Engineering calculation, quantity and cost workbooks produced from project data rather than retyped.",
        capabilities: [
          "Automated Engineering Calculations",
          "Automated Quantity Calculations",
          "Automated BOQ Generation",
          "Automated Material Takeoff",
          "Automated Equipment Schedules",
          "Automated Load Schedules",
          "Automated Calculation Reports",
        ],
      },
      {
        id: "data-management",
        name: "Data Management",
        description:
          "Cleaning, validation, registers and trackers — the housekeeping that keeps a project's data trustworthy.",
        capabilities: [
          "Automated Data Cleaning",
          "Automated Data Validation",
          "Automated Drawing Registers",
          "Automated Project Trackers",
          "Automated Report Generation",
        ],
      },
      {
        id: "model-exchange",
        name: "Model Exchange",
        description:
          "Data moved in both directions between the spreadsheet and the CAD or BIM model.",
        capabilities: [
          "CAD/BIM Data → Excel",
          "Excel → CAD/BIM Data",
          "Automated Workbook Generation",
          "Automated Formula & Template Management",
        ],
      },
    ],
  },

  /* ================================================================== */
  /* POWER BI                                                            */
  /* ================================================================== */
  {
    id: "power-bi",
    slug: "power-bi",
    name: "Microsoft Power BI",
    shortName: "Power BI",
    vendor: "Microsoft",
    glyph: "bar-chart",
    logo: "/logos/power-bi.svg",
    // Power BI's yellow is too light to carry a white letterform.
    mark: { letters: "BI", color: "#F2C811", onColor: "#0C1015" },
    role: "Reporting & dashboards",
    tagline: "Project reporting that refreshes itself.",
    description:
      "Every dashboard here is fed from data the project already produces — the model, the clash report, the schedule, the BOQ. Once wired, progress, cost, quantity and QA/QC reporting refreshes without anyone rebuilding a deck the night before the meeting.",
    groups: [
      {
        id: "project-dashboards",
        name: "Project Dashboards",
        description:
          "The core delivery picture — progress, quantity, cost and programme in one refreshing view.",
        capabilities: [
          "BIM Dashboard Automation",
          "Project Progress Dashboard",
          "Quantity Dashboard",
          "Cost Dashboard",
          "Schedule Dashboard",
        ],
      },
      {
        id: "delivery-dashboards",
        name: "Delivery & Quality",
        description:
          "Coordination, quality, procurement and resource reporting for the people running the job.",
        capabilities: [
          "Clash Dashboard",
          "QA/QC Dashboard",
          "Procurement Dashboard",
          "Resource Dashboard",
          "Drawing Status Dashboard",
          "Model Status Dashboard",
        ],
      },
      {
        id: "portfolio",
        name: "Portfolio & Executive",
        description:
          "Multi-project and management-level reporting, refreshed on a schedule rather than on request.",
        capabilities: [
          "Automated Data Refresh",
          "Multi-Project Dashboard",
          "Construction Progress Reporting",
          "Executive Management Dashboard",
        ],
      },
    ],
  },

  /* ================================================================== */
  /* PRIMAVERA P6                                                        */
  /* ================================================================== */
  {
    id: "primavera",
    slug: "primavera-p6",
    name: "Oracle Primavera P6",
    shortName: "Primavera P6",
    vendor: "Oracle",
    glyph: "gantt",
    mark: { letters: "P6", color: "#C74634" },
    role: "Planning & scheduling",
    tagline: "Schedules built from the model, updated from the site.",
    description:
      "Building a P6 schedule by hand from a drawing register is slow and goes stale immediately. These routines generate the WBS and activities from project data, load resources, roll updates forward, and push the result out to reporting.",
    groups: [
      {
        id: "schedule-creation",
        name: "Schedule Creation",
        description:
          "The programme built from project data — WBS, activities, resources and baseline.",
        capabilities: [
          "Automated Project Schedule Creation",
          "Activity Generation",
          "WBS Generation",
          "Resource Loading",
          "Baseline Creation",
        ],
      },
      {
        id: "schedule-control",
        name: "Schedule Control",
        description:
          "Updates, progress, delay and critical path — the monthly cycle that keeps the programme honest.",
        capabilities: [
          "Schedule Updates",
          "Progress Updates",
          "Delay Analysis",
          "Critical Path Analysis",
          "Look-Ahead Schedule Generation",
          "Resource & Productivity Tracking",
          "Planned vs Actual Analysis",
        ],
      },
      {
        id: "reporting-export",
        name: "Reporting & Export",
        description:
          "Schedule and progress reporting, and the handoff into the wider reporting stack.",
        capabilities: [
          "Schedule Reports",
          "Progress Reports",
          "Schedule Data Export",
          "P6 → Power BI Integration",
        ],
      },
    ],
  },

  /* ================================================================== */
  /* ETABS                                                               */
  /* ================================================================== */
  {
    id: "etabs",
    slug: "etabs",
    name: "CSI ETABS",
    shortName: "ETABS",
    vendor: "Computers & Structures, Inc.",
    glyph: "frame",
    mark: { letters: "ET", color: "#1F4E79" },
    role: "Structural analysis & design",
    tagline: "Analysis models generated, loaded, run and reported.",
    description:
      "Rebuilding a structural model by hand for every option is where structural engineering time disappears. These routines generate the grid, frame and slab arrangement, apply the load cases and combinations, run the analysis, and take the results back out as design checks, foundation loads and a calculation report.",
    groups: [
      {
        id: "model-generation",
        name: "Model Generation",
        description:
          "The analysis model built from the architectural grid and structural arrangement.",
        capabilities: [
          "Automated Structural Model Creation",
          "Grid & Storey Generation",
          "Column & Beam Generation",
          "Slab Generation",
          "Wall Generation",
        ],
      },
      {
        id: "loading",
        name: "Loading",
        description:
          "Load cases, combinations and the code-driven seismic and wind setup applied consistently.",
        capabilities: [
          "Load Assignment",
          "Load Combination Generation",
          "Seismic Load Setup",
          "Wind Load Setup",
        ],
      },
      {
        id: "analysis-design",
        name: "Analysis & Design",
        description:
          "The run itself, plus the member, drift and design checks that follow it.",
        capabilities: [
          "Analysis Automation",
          "Structural Design Automation",
          "Member Design Checks",
          "Drift Checks",
        ],
      },
      {
        id: "results-output",
        name: "Results & Output",
        description:
          "Results taken back out as foundation loads, quantities, calculation reports and a QA/QC pass.",
        capabilities: [
          "Foundation Load Extraction",
          "Structural Quantity Extraction",
          "Calculation Report Generation",
          "Model QA/QC",
        ],
      },
    ],
  },

  /* ================================================================== */
  /* MS PROJECT                                                          */
  /* ================================================================== */
  {
    id: "ms-project",
    slug: "ms-project",
    name: "Microsoft Project",
    shortName: "MS Project",
    vendor: "Microsoft",
    glyph: "calendar",
    logo: "/logos/ms-project.svg",
    mark: { letters: "P", color: "#31752F" },
    role: "Project management",
    tagline: "The same scheduling automation, on the Microsoft stack.",
    description:
      "For teams planning in MS Project rather than P6, the same automation applies — the WBS and tasks generated from project data, resources and dependencies assigned, progress rolled forward, and the result exchanged with Excel and Power BI.",
    groups: [
      {
        id: "schedule-setup",
        name: "Schedule Setup",
        description:
          "The plan built out — WBS, tasks, resources, durations, dependencies and baseline.",
        capabilities: [
          "Automated Project Schedule Creation",
          "WBS Generation",
          "Task Generation",
          "Resource Assignment",
          "Duration & Dependency Setup",
          "Baseline Creation",
        ],
      },
      {
        id: "tracking",
        name: "Tracking & Analysis",
        description:
          "Progress, critical path, resources and milestones tracked against the baseline.",
        capabilities: [
          "Progress Updates",
          "Schedule Tracking",
          "Critical Path Analysis",
          "Resource Planning",
          "Milestone Tracking",
          "Planned vs Actual Analysis",
        ],
      },
      {
        id: "reporting-exchange",
        name: "Reporting & Exchange",
        description:
          "Status reporting, and the two-way exchange with Excel and Power BI.",
        capabilities: [
          "Project Status Reports",
          "Automated Progress Reports",
          "Excel ↔ MS Project Data Exchange",
          "MS Project → Power BI Reporting",
        ],
      },
    ],
  },
];

export const softwarePlatformMap: Record<string, SoftwarePlatform> =
  softwarePlatforms.reduce<Record<string, SoftwarePlatform>>((acc, platform) => {
    acc[platform.id] = platform;
    return acc;
  }, {});

export function findPlatformBySlug(slug: string): SoftwarePlatform | undefined {
  return softwarePlatforms.find((platform) => platform.slug === slug);
}

export function getPlatform(id: SoftwareId): SoftwarePlatform | undefined {
  return softwarePlatformMap[id];
}

/* ------------------------------------------------------------------ */
/* Cross-platform automation                                           */
/*                                                                     */
/* The point of the whole thing: one connected ecosystem where design → */
/* analysis → coordination → documentation → scheduling → reporting →   */
/* project management runs across the full project lifecycle instead of */
/* stopping at each application boundary.                               */
/* ------------------------------------------------------------------ */

export const crossPlatformFlows: CrossPlatformFlow[] = [
  { from: "AutoCAD", to: "Revit", label: "AutoCAD ↔ Revit" },
  { from: "Revit", to: "Navisworks", label: "Revit ↔ Navisworks" },
  { from: "AutoCAD", to: "Navisworks", label: "AutoCAD ↔ Navisworks" },
  { from: "Revit", to: "Excel", label: "Revit → Excel" },
  { from: "Navisworks", to: "Excel", label: "Navisworks → Excel" },
  { from: "ETABS", to: "Excel", label: "ETABS → Excel" },
  { from: "Primavera P6", to: "Power BI", label: "Primavera → Power BI" },
  { from: "MS Project", to: "Power BI", label: "MS Project → Power BI" },
  { from: "Excel", to: "Power BI", label: "Excel → Power BI" },
  { from: "BIM", to: "Quantity takeoff", label: "BIM → Quantity Takeoff" },
  { from: "BIM", to: "Project schedule", label: "BIM → Project Schedule" },
  { from: "Model", to: "Progress tracking", label: "Model → Progress Tracking" },
  { from: "Model", to: "QA/QC report", label: "Model → QA/QC Report" },
  { from: "Engineering calculation", to: "Drawing", label: "Engineering Calculation → Drawing" },
  { from: "Project data", to: "Dashboard", label: "Project Data → Automated Dashboard" },
  { from: "Project", to: "Submission", label: "Automated Project Submission Package" },
];
