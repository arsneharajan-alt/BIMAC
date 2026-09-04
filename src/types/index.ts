/**
 * BIMAC domain model.
 *
 * The catalogue is organised the way a customer thinks about it:
 *   Discipline  →  Group  →  Tool
 * with project Stage as a second axis and host Software demoted to a filter.
 *
 * A visitor identifies as an architect, a structural engineer, or an MEP
 * engineer long before they think about which application a plugin loads into.
 */

/* ------------------------------------------------------------------ */
/* Disciplines                                                         */
/* ------------------------------------------------------------------ */

export type DisciplineId =
  | "architecture"
  | "structure"
  | "hvac"
  | "electrical"
  | "plumbing"
  | "fire-fighting"
  | "fire-alarm"
  | "elv-ict"
  | "bms"
  | "bim-revit";

/** MEPF is a parent that collects the seven services disciplines. */
export type DisciplineFamilyId = "architecture" | "structure" | "mepf" | "bim-revit";

export interface DisciplineGroup {
  id: string;
  name: string;
  description: string;
}

export interface Discipline {
  id: DisciplineId;
  /** URL segment under /tools. */
  slug: string;
  name: string;
  shortName: string;
  family: DisciplineFamilyId;
  tagline: string;
  description: string;
  /** Who this discipline is for, in their own words. */
  audience: string;
  glyph: GlyphId;
  groups: DisciplineGroup[];
  faqs?: Faq[];
}

export interface DisciplineFamily {
  id: DisciplineFamilyId;
  name: string;
  shortName: string;
  tagline: string;
  glyph: GlyphId;
  /** Disciplines inside this family, in display order. */
  members: DisciplineId[];
  /** Family-level landing route. */
  slug: string;
}

/* ------------------------------------------------------------------ */
/* Project stages — the lifecycle axis                                 */
/* ------------------------------------------------------------------ */

/**
 * One lifecycle shared by every discipline, so a tool's position is comparable
 * across architecture, structure, and the seven MEPF services. Not every
 * discipline uses every stage — architecture has no analysis stage, MEPF has
 * no site stage — and the hubs simply omit the ones that are empty.
 */
export type StageId =
  | "feasibility"
  | "concept"
  | "schematic"
  | "detailed"
  | "analysis"
  | "documentation"
  | "coordination"
  | "construction"
  | "as-built";

export interface Stage {
  id: StageId;
  slug: string;
  name: string;
  lod: string;
  tagline: string;
  description: string;
  glyph: GlyphId;
}

/* ------------------------------------------------------------------ */
/* Host software — a filter, not the hierarchy                         */
/* ------------------------------------------------------------------ */

export type SoftwareId =
  | "revit"
  | "autocad"
  | "navisworks"
  | "excel"
  | "power-bi"
  | "primavera"
  | "etabs"
  | "ms-project"
  | "standalone";

export interface Software {
  id: SoftwareId;
  name: string;
  shortName: string;
  glyph: GlyphId;
}

/* ------------------------------------------------------------------ */
/* Software platforms — the second way in                              */
/*                                                                     */
/* Discipline stays the primary axis, but a visitor who arrives asking  */
/* "what can you automate in AutoCAD?" deserves a straight answer. Each */
/* platform lists its automation scope grouped the way that application */
/* is actually used.                                                    */
/* ------------------------------------------------------------------ */

export interface SoftwareCapabilityGroup {
  id: string;
  name: string;
  description?: string;
  /** Capability names, in the order they run on a real project. */
  capabilities: string[];
}

/**
 * A product mark — the coloured tile that stands in for a software logo.
 *
 * Original artwork, not the vendor's trademark: initials set in that product's
 * own colour, which is what makes a row of eight platforms scannable. If BIMAC
 * ever licenses the official logos, this is the one place to swap.
 */
export interface ProductMark {
  /** One or two characters. Three starts to look like a word. */
  letters: string;
  /** Background, as a hex string — these sit outside the Tailwind palette. */
  color: string;
  /** Override the white letterform where the background is too light. */
  onColor?: string;
}

export interface SoftwarePlatform {
  id: SoftwareId;
  /** URL segment under /software. */
  slug: string;
  name: string;
  shortName: string;
  vendor: string;
  tagline: string;
  description: string;
  glyph: GlyphId;
  /**
   * Path under /public to the vendor's own product logo, when one is on file.
   * Takes precedence over `mark` everywhere a platform is shown.
   */
  logo?: string;
  /** Fallback used until the real logo is dropped in. */
  mark: ProductMark;
  /** Where this platform sits in the design → handover chain. */
  role: string;
  groups: SoftwareCapabilityGroup[];
  /**
   * Build the groups from the live catalogue instead of the authored list.
   * Revit uses this, because its automation already ships as listed tools.
   */
  fromCatalogue?: boolean;
}

/** One automation that carries data from one platform to another. */
export interface CrossPlatformFlow {
  from: string;
  to: string;
  label: string;
}

/* ------------------------------------------------------------------ */
/* Tools                                                               */
/* ------------------------------------------------------------------ */

export type ToolStatus = "available" | "in-development" | "planned";

export interface ToolVideo {
  /** How the demo is hosted. `none` falls back to the animated preview. */
  kind: "youtube" | "vimeo" | "file" | "none";
  /** YouTube/Vimeo id, or a path under /public for a self-hosted file. */
  id?: string;
  duration?: string;
  poster?: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;

  /** Every discipline this tool serves. First entry is the canonical one. */
  disciplines: DisciplineId[];
  /** Group id within the canonical discipline. */
  group: string;
  stage: StageId;
  software: SoftwareId[];

  /** One line, used on cards. */
  summary: string;
  /** Two or three sentences, used in the tool hero. */
  description: string;
  /** Longer explanation, one string per paragraph. */
  what: string[];

  features: string[];
  inputs: string[];
  outputs: string[];

  status: ToolStatus;
  /** Surfaced on the homepage and discipline hubs. */
  featured?: boolean;
  video: ToolVideo;
  /** Which drawn interface stands in for a screenshot. */
  mockup: MockupLayout;
  glyph: GlyphId;
}

export type MockupLayout = "panel" | "table" | "dashboard" | "viewer" | "wizard";

/* ------------------------------------------------------------------ */
/* Filtering + sorting                                                 */
/* ------------------------------------------------------------------ */

export type SortId = "featured" | "az" | "stage" | "status";

export interface ToolFilterState {
  query: string;
  disciplines: DisciplineId[];
  stages: StageId[];
  software: SoftwareId[];
  statuses: ToolStatus[];
  sort: SortId;
}

/* ------------------------------------------------------------------ */
/* Supporting content                                                  */
/* ------------------------------------------------------------------ */

export interface Faq {
  question: string;
  answer: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  kind: ResourceKind;
  meta: string;
  glyph: GlyphId;
}

export type ResourceKind = "documentation" | "tutorial" | "video" | "download";

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

export type SearchResultKind = "tool" | "discipline" | "stage" | "software" | "page";

export interface SearchResult {
  kind: SearchResultKind;
  title: string;
  description: string;
  href: string;
  meta?: string;
  glyph: GlyphId;
  score: number;
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

export type GlyphId =
  | "arrow-right"
  | "arrow-up-right"
  | "bar-chart"
  | "book"
  | "box"
  | "building"
  | "calculator"
  | "calendar"
  | "check"
  | "check-circle"
  | "chevron-down"
  | "chevron-right"
  | "clock"
  | "close"
  | "code"
  | "compass"
  | "cpu"
  | "cube"
  | "database"
  | "download"
  | "droplet"
  | "file-text"
  | "filter"
  | "flame"
  | "frame"
  | "gantt"
  | "globe"
  | "grid"
  | "home"
  | "layers"
  | "link"
  | "linkedin"
  | "list"
  | "mail"
  | "map-pin"
  | "menu"
  | "message-circle"
  | "minus"
  | "package"
  | "phone"
  | "play"
  | "plus"
  | "quote"
  | "rocket"
  | "ruler"
  | "search"
  | "settings"
  | "shield-check"
  | "sitemap"
  | "sliders"
  | "sparkles"
  | "star"
  | "tag"
  | "target"
  | "users"
  | "video"
  | "whatsapp"
  | "wind"
  | "workflow"
  | "x-social"
  | "youtube"
  | "zap";
