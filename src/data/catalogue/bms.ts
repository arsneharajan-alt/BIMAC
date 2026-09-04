import type { ToolSeed } from "./shared";

/**
 * BMS & Controls — the service that binds every other one, and the one most
 * often documented last and worst. Architecture and points, the controls
 * package, coordination, commissioning, and handover data.
 */
export const bmsTools: ToolSeed[] = [
  /* ================================================================ */
  /* CONCEPT & ARCHITECTURE                                           */
  /* ================================================================ */
  {
    id: "bms-concept-design",
    name: "BMS Concept Design",
    slug: "bms-concept-design",
    disciplines: ["bms"],
    group: "concept-design",
    stage: "concept",
    software: ["standalone", "revit"],
    glyph: "sliders",
    mockup: "wizard",
    summary: "Decide what the building will control, monitor, and meter — and price it.",
    description:
      "Translates the operational brief into a controls scope — which systems are controlled, which are monitored, what is metered, and to what granularity — with the resulting point count estimated early.",
    what: [
      "The BMS scope is described in a specification as a set of narrative requirements, and its cost is a point count that nobody produces until tender. The two are consequently negotiated on different bases.",
      "This tool derives the point count from the equipment actually in the model against the scope decisions, so the controls scope can be discussed as a number from the start.",
    ],
    features: [
      "Controls, monitoring, and metering scope set per system and per zone",
      "Indicative point count derived from the equipment in the model",
      "Metering granularity tested against the energy reporting requirement",
      "Head-end, network, and controller topology sized to the point count",
      "Scope and point count exported for early costing and tender",
    ],
    inputs: ["Operational and energy brief", "Model with mechanical and electrical equipment", "Metering requirements"],
    outputs: ["Controls scope definition", "Indicative point count", "Costing export"],
  },
  {
    id: "controls-architecture",
    name: "Controls Architecture",
    slug: "controls-architecture",
    disciplines: ["bms"],
    group: "concept-design",
    stage: "concept",
    software: ["standalone", "revit"],
    glyph: "sitemap",
    mockup: "dashboard",
    summary: "Design the network the points hang off, before the points exist.",
    description:
      "Generates the controls network topology — head-end, supervisors, field controllers, and bus segments — with segment loading, cable distance limits, and protocol boundaries checked.",
    what: [
      "The controls network is normally drawn as a schematic with no relationship to the building's geometry, so the field bus segments turn out to exceed their distance limits and the controllers turn out to be too far from the plant they serve.",
      "This tool lays the topology out against the model, so segment lengths and controller positions are real, and reports every segment that breaches its limit.",
    ],
    features: [
      "Network topology generated from head-end through supervisors to field controllers",
      "Bus segment lengths measured against the model, not estimated",
      "Segment device loading checked against protocol limits",
      "Protocol boundaries and gateway positions identified explicitly",
      "Segments exceeding a distance or loading limit reported with their cause",
    ],
    inputs: ["Controls scope and point count", "Plant positions and building geometry", "Protocol and segment limits"],
    outputs: ["Network topology design", "Segment loading and length schedule", "Limit exception report"],
  },

  /* ================================================================ */
  /* LAYOUT & POINTS                                                  */
  /* ================================================================ */
  {
    id: "controller-placement",
    name: "Controller Placement",
    slug: "controller-placement",
    disciplines: ["bms"],
    group: "layout-modeling",
    stage: "schematic",
    software: ["revit"],
    glyph: "cpu",
    mockup: "panel",
    summary: "Place panels where the plant is, sized for the points they serve.",
    description:
      "Places field controllers and control panels against the plant they serve, sizes each for its point count with spare capacity, and checks cable distance, access, and power supply availability.",
    what: [
      "Control panels are placed where there is wall space, then wired to plant that turns out to be beyond the field cable distance limit, in positions that cannot be reached for maintenance without a ladder.",
      "This tool places them against the served plant, sizes them for the actual point count, and checks the distance and access constraints in the model.",
    ],
    features: [
      "Controllers and panels placed against the plant and points they serve",
      "Panel sized for its point count with spare capacity held to a set percentage",
      "Field cable distances from panel to device checked against the limit",
      "Access, clearance, and power supply availability verified in the model",
      "Panels that cannot serve their plant within the limits reported",
    ],
    inputs: ["Plant and equipment positions", "Point allocation per panel", "Distance, access, and power rules"],
    outputs: ["Placed controllers and panels", "Panel point capacity schedule", "Exception report"],
  },
  {
    id: "sensor-placement",
    name: "Sensor Placement",
    slug: "sensor-placement",
    disciplines: ["bms"],
    group: "layout-modeling",
    stage: "detailed",
    software: ["revit"],
    glyph: "target",
    mockup: "viewer",
    summary: "Place sensors where they will read the condition they are controlling.",
    description:
      "Places space, duct, pipe, and plant sensors from the control strategy, checking each position against the rules that determine whether the reading will be representative.",
    what: [
      "A temperature sensor above a radiator, a CO2 sensor in a corner, a duct sensor immediately downstream of a coil — each is placed on a drawing without objection and each produces a control loop that never stabilises.",
      "This tool applies the placement rules that make a reading representative, checks them against the model geometry, and reports every sensor whose position will misread.",
    ],
    features: [
      "Space, duct, pipe, and plant sensors placed from the control strategy",
      "Space sensors checked against solar gain, heat sources, and airflow paths",
      "Duct and pipe sensors placed at the required distance from coils and bends",
      "Sensor type selected per application rather than applied uniformly",
      "Positions likely to produce an unrepresentative reading reported explicitly",
    ],
    inputs: ["Control strategy and point list", "Mechanical model and space data", "Sensor placement rules"],
    outputs: ["Placed sensors", "Placement validation report", "Sensor schedule"],
  },
  {
    id: "point-generation",
    name: "Point Generation",
    slug: "point-generation",
    disciplines: ["bms"],
    group: "layout-modeling",
    stage: "detailed",
    software: ["revit", "excel"],
    glyph: "list",
    mockup: "table",
    summary: "Generate the point list from the equipment that is actually in the model.",
    description:
      "Builds the full point list from the modelled plant and its control strategy, applying a point template per equipment type, naming every point to convention, and allocating it to a controller.",
    what: [
      "The point list is the single most important BMS document and it is normally typed by hand from an equipment schedule. It is therefore both incomplete and out of date the moment a piece of plant is added.",
      "This tool generates it from the model — every AHU of a given type gets the same point template — names each point to convention, and re-runs when the plant changes so the list never lags the design.",
    ],
    features: [
      "Point templates applied per equipment type across all matching plant",
      "Every point named to your convention from the equipment and space data",
      "Points allocated to controllers with panel capacity checked as it fills",
      "Hard and soft points distinguished, with I/O type recorded per point",
      "Regenerates after plant changes, reporting points added and removed",
    ],
    inputs: ["Modelled plant and equipment", "Point templates per equipment type", "Naming convention"],
    outputs: ["Full point list with allocation", "Point count by panel and type", "Change report"],
  },
  {
    id: "equipment-controls",
    name: "Equipment Controls",
    slug: "equipment-controls",
    disciplines: ["bms"],
    group: "layout-modeling",
    stage: "detailed",
    software: ["revit", "excel"],
    glyph: "settings",
    mockup: "table",
    summary: "Attach the control strategy to each item of plant as data, not prose.",
    description:
      "Applies a control strategy to every item of plant — setpoints, sequences, interlocks, safeties, and alarm limits — as structured data on the equipment rather than as narrative in a specification.",
    what: [
      "Control strategies live in a specification as paragraphs of prose, which a controls contractor then reinterprets into software. Every reinterpretation is an opportunity for the building to behave differently from the design.",
      "This tool attaches the strategy to the equipment as structured data — setpoints, sequences, interlocks, alarm limits — so it can be checked, compared between plant items, and exported to the controls contractor unambiguously.",
    ],
    features: [
      "Control strategy applied per equipment type from a reusable library",
      "Setpoints, sequences, interlocks, and safeties held as data on the equipment",
      "Alarm limits and priorities defined per point rather than left to the installer",
      "Strategies compared across identical plant, with inconsistencies reported",
      "Structured export to the controls contractor rather than a prose specification",
    ],
    inputs: ["Modelled plant with points", "Control strategy library", "Alarm and setpoint standards"],
    outputs: ["Strategies attached to equipment", "Inconsistency report", "Contractor export"],
  },
  {
    id: "hvac-controls",
    name: "HVAC Controls",
    slug: "hvac-controls",
    disciplines: ["bms"],
    group: "layout-modeling",
    stage: "detailed",
    software: ["revit"],
    glyph: "wind",
    mockup: "viewer",
    summary: "Design the control loops around the mechanical systems in the model.",
    description:
      "Generates the HVAC control loops from the mechanical model — valves, dampers, actuators, and sensors placed on the actual systems, with zone control strategies and sequences attached.",
    what: [
      "Control valves and dampers appear on the mechanical drawing as symbols and on the controls drawing as points, and the two are reconciled by somebody reading both. Anything that appears on one and not the other is found at commissioning.",
      "This tool places the control devices onto the mechanical systems in the model itself, so the valve on the pipe and the point on the list are the same object.",
    ],
    features: [
      "Control valves, dampers, and actuators placed onto the modelled systems",
      "Zone control strategy applied per space type and system",
      "Sequences generated for air handling, terminal units, and wet systems",
      "Control devices reconciled against the mechanical schedule automatically",
      "Systems with no control strategy assigned reported explicitly",
    ],
    inputs: ["Mechanical model with systems", "Zone control strategies", "Control device library"],
    outputs: ["Placed control devices", "Zone control schedule", "Unstrategised system report"],
  },
  {
    id: "electrical-monitoring",
    name: "Electrical Monitoring",
    slug: "electrical-monitoring",
    disciplines: ["bms"],
    group: "layout-modeling",
    stage: "detailed",
    software: ["revit"],
    glyph: "zap",
    mockup: "table",
    summary: "Define what is monitored on the electrical systems, and where from.",
    description:
      "Generates the electrical monitoring scope from the distribution model — board status, breaker positions, power quality, generator and UPS monitoring — with points allocated and interfaces defined.",
    what: [
      "Electrical monitoring is specified generically and delivered inconsistently, so the head-end ends up showing the status of some boards and not others, with no record of which was intended.",
      "This tool generates the monitoring scope from the distribution tree itself, so every board is either deliberately monitored or deliberately not, and the interface for each is specified.",
    ],
    features: [
      "Monitoring scope generated per board from the electrical distribution tree",
      "Status, alarm, and power quality points defined per monitored device",
      "Generator, UPS, and transfer switch monitoring interfaces specified",
      "Interface method recorded per device — hardwired, Modbus, or gateway",
      "Boards outside the monitoring scope listed explicitly rather than omitted",
    ],
    inputs: ["Electrical distribution model", "Monitoring scope requirements", "Interface protocol options"],
    outputs: ["Monitoring point schedule", "Interface specification per device", "Scope coverage report"],
  },
  {
    id: "metering",
    name: "Metering",
    slug: "metering",
    disciplines: ["bms"],
    group: "layout-modeling",
    stage: "detailed",
    software: ["revit", "excel"],
    glyph: "calculator",
    mockup: "dashboard",
    summary: "Place meters so the energy reporting the client asked for is possible.",
    description:
      "Places energy, water, and thermal meters across the distribution systems and checks that the resulting metering tree can actually produce the reporting breakdown the brief requires.",
    what: [
      "Metering is specified as a reporting requirement — energy by end use, by tenancy, by system — and delivered as a set of meters placed where it was convenient. The reporting requirement then turns out to be unachievable because two end uses share a submeter.",
      "This tool checks the metering tree against the reporting requirement and reports exactly which breakdowns cannot be produced from the meters proposed.",
    ],
    features: [
      "Energy, water, and thermal meters placed across the distribution systems",
      "Metering tree built and checked for completeness against the parent meter",
      "Required reporting breakdowns tested against the proposed meter positions",
      "Unachievable breakdowns reported with the meter that would resolve them",
      "Unmetered and double-counted loads identified explicitly",
    ],
    inputs: ["Electrical and mechanical distribution models", "Energy reporting requirements", "Meter library"],
    outputs: ["Placed meters and metering tree", "Reporting achievability report", "Unmetered load schedule"],
  },

  /* ================================================================ */
  /* DOCUMENTATION                                                    */
  /* ================================================================ */
  {
    id: "bms-annotation",
    name: "BMS Tagging & Annotation",
    slug: "bms-tagging-annotation",
    disciplines: ["bms"],
    group: "documentation",
    stage: "documentation",
    software: ["revit"],
    glyph: "tag",
    mockup: "panel",
    summary: "Tag control devices with point reference, panel, and system.",
    description:
      "Places device, point reference, panel, and system annotation across controls views to your standard, re-running after point reallocation so references never go stale.",
    what: [
      "A control device on a drawing is only useful if it carries its point reference and its panel, and both change whenever points are reallocated between controllers.",
      "This tool takes them from the point list and re-runs after any reallocation, so the drawing and the point schedule cannot disagree.",
    ],
    features: [
      "Control device, point reference, panel, and system tagged from model data",
      "Re-runs cleanly after point reallocation between controllers",
      "Sensor and actuator types annotated alongside their reference",
      "Overlap-aware placement with readable leaders",
      "Exception report for unplaceable annotation",
    ],
    inputs: ["Controls views", "Annotation standard and tag families", "Point list and panel allocation"],
    outputs: ["Annotated views", "Placed tags", "Exception report"],
  },
  {
    id: "control-schematics",
    name: "Control Schematics",
    slug: "control-schematics",
    disciplines: ["bms"],
    group: "documentation",
    stage: "documentation",
    software: ["revit", "standalone"],
    glyph: "workflow",
    mockup: "viewer",
    summary: "Generate the plant schematic from the system it controls.",
    description:
      "Produces control schematics per plant item from the modelled system and its point list — devices, sensors, valves, dampers, and sequences — regenerating whenever the strategy or the plant changes.",
    what: [
      "Control schematics are drawn once in CAD from a typical, then edited by hand for each plant item. They stop matching the point list quickly, and the controls contractor programs from whichever document they were given.",
      "This tool generates each schematic from the actual system and its point list, so a point added to the list appears on the schematic without anybody redrawing it.",
    ],
    features: [
      "Schematic generated per plant item from the modelled system and point list",
      "Sensors, valves, dampers, and interlocks drawn from the assigned control devices",
      "Sequence of operation printed alongside the schematic from the strategy data",
      "Regenerates after a point or strategy change rather than being redrawn",
      "Discrepancy between schematic and point list impossible by construction",
    ],
    inputs: ["Modelled plant with points and strategy", "Schematic symbol standard", "Sequence library"],
    outputs: ["Control schematics per plant item", "Sequence of operation", "Change summary"],
  },
  {
    id: "point-schedules",
    name: "Point Schedules",
    slug: "point-schedules",
    disciplines: ["bms"],
    group: "documentation",
    stage: "documentation",
    software: ["revit", "excel"],
    glyph: "list",
    mockup: "table",
    summary: "Issue the point schedule the contractor can import, not retype.",
    description:
      "Produces the full point schedule by panel, plant item, and type, with I/O counts, spare capacity, alarm limits, and naming, exported in a format the controls contractor can import directly.",
    what: [
      "The point schedule is issued as a PDF, retyped by the controls contractor into their engineering tool, and the retyping introduces the naming inconsistencies that the head-end then displays for the life of the building.",
      "This tool exports it in an importable form with the naming already correct, which removes both the retyping and the errors it produces.",
    ],
    features: [
      "Full point schedule generated by panel, plant item, and point type",
      "I/O counts and spare capacity reported per controller",
      "Alarm limits, priorities, and trending requirements carried per point",
      "Naming applied consistently from the convention, ready for the head-end",
      "Exported in a format the controls contractor can import directly",
    ],
    inputs: ["Generated point list", "Naming convention and alarm standards", "Contractor import format"],
    outputs: ["Point schedule by panel and plant", "Spare capacity report", "Importable point file"],
  },
  {
    id: "bms-documentation",
    name: "BMS Documentation",
    slug: "bms-documentation",
    disciplines: ["bms"],
    group: "documentation",
    stage: "documentation",
    software: ["revit", "excel"],
    glyph: "file-text",
    mockup: "table",
    summary: "Assemble the controls package — schematics, points, network, and sequences.",
    description:
      "Generates the complete controls package from a register — network diagrams, control schematics, point schedules, sequences, and panel layouts — all derived from the same model data.",
    what: [
      "A controls package is four documents that must agree: the network diagram, the schematics, the point schedule, and the sequences. Produced separately, they never quite do, and the contractor resolves the differences by choosing one.",
      "This tool generates all four from one model, so agreement between them is structural rather than something to be checked.",
    ],
    features: [
      "Network topology diagrams generated from the controls architecture",
      "Control schematics and sequences issued from the same source as the points",
      "Panel layouts and terminal schedules produced per controller",
      "Complete package assembled from a register with consistent titleblocks",
      "Revisions applied across the whole package at once",
    ],
    inputs: ["Controls model, points, and strategies", "Drawing register", "Placement templates"],
    outputs: ["Complete controls package", "Network and panel drawings", "Applied revisions"],
  },

  /* ================================================================ */
  /* COORDINATION                                                     */
  /* ================================================================ */
  {
    id: "bms-coordination",
    name: "BMS Coordination",
    slug: "bms-coordination",
    disciplines: ["bms"],
    group: "coordination",
    stage: "coordination",
    software: ["revit"],
    glyph: "target",
    mockup: "dashboard",
    summary: "Reconcile the point list against every system it claims to control.",
    description:
      "Checks the point list against the mechanical, electrical, and fire models — every controlled device present, every monitored board interfaced, every fire interface accounted for — and reports both gaps and orphans.",
    what: [
      "The BMS is the only service whose deliverable depends entirely on other people's models. A valve deleted from the mechanical model leaves a point that controls nothing; a damper added leaves a device nobody is controlling. Neither shows up as a clash.",
      "This tool reconciles the point list against every source model and reports both directions — points with no device, and devices with no point.",
    ],
    features: [
      "Point list reconciled against the mechanical, electrical, and fire models",
      "Points referencing deleted or renamed equipment reported as orphans",
      "Controllable devices with no assigned point reported as gaps",
      "Fire alarm and life safety interfaces reconciled against the cause and effect matrix",
      "Panel and cable route coordination checked against the coordinated model",
    ],
    inputs: ["Point list and controls model", "Mechanical, electrical, and fire models", "Cause and effect matrix"],
    outputs: ["Reconciliation results", "Orphan and gap report", "Coordination issues"],
  },

  /* ================================================================ */
  /* TESTING & COMMISSIONING                                          */
  /* ================================================================ */
  {
    id: "testing-commissioning",
    name: "Testing & Commissioning",
    slug: "bms-testing-commissioning",
    disciplines: ["bms"],
    group: "commissioning",
    stage: "construction",
    software: ["revit", "excel", "standalone"],
    glyph: "check-circle",
    mockup: "dashboard",
    summary: "Track commissioning against the point list rather than a spreadsheet.",
    description:
      "Generates point-to-point and functional test schedules from the point list, records results against each point and sequence, and reports completion as a percentage of points actually witnessed.",
    what: [
      "Commissioning progress is reported as a percentage that comes from a spreadsheet somebody maintains, and the spreadsheet is not the point list, so the two diverge and the outstanding items are only truly known at the end.",
      "This tool tracks against the point list itself, so completion is a count of points witnessed and the outstanding list is always current and always specific.",
    ],
    features: [
      "Point-to-point test schedules generated directly from the point list",
      "Functional test scripts generated from the sequences of operation",
      "Results recorded against each point, sequence, and plant item",
      "Completion reported as points witnessed, not as an estimated percentage",
      "Outstanding items listed specifically, by panel and by plant item",
    ],
    inputs: ["Point list and sequences", "Test procedure standard", "Witnessed results from site"],
    outputs: ["Test schedules and scripts", "Recorded results per point", "Outstanding items register"],
  },

  /* ================================================================ */
  /* AS-BUILT                                                         */
  /* ================================================================ */
  {
    id: "bms-as-built-data",
    name: "BMS As-Built Data",
    slug: "bms-as-built-data",
    disciplines: ["bms"],
    group: "as-built",
    stage: "as-built",
    software: ["revit", "excel"],
    glyph: "database",
    mockup: "table",
    summary: "Hand over the point list the head-end is actually running.",
    description:
      "Reconciles the design point list against the as-commissioned head-end database, records final setpoints and alarm limits, and issues the controls record as structured data against the model.",
    what: [
      "Points are added, renamed, and disabled throughout commissioning, and the head-end database ends up as the only accurate record. It is handed over as a backup file that nobody can read against the design documents.",
      "This tool reconciles the two, so the handover point list is the one the building is running, with final setpoints recorded and every difference from the design explained.",
    ],
    features: [
      "Design point list reconciled against the as-commissioned head-end database",
      "Points added, renamed, or disabled during commissioning identified individually",
      "Final setpoints, alarm limits, and schedules recorded against each point",
      "Controls record linked to the equipment in the as-built model",
      "Differences from the design point list reported rather than silently absorbed",
    ],
    inputs: ["Design point list", "As-commissioned head-end database export", "Final setpoints and schedules"],
    outputs: ["Reconciled as-built point list", "Difference report", "Structured controls handover data"],
  },
];
