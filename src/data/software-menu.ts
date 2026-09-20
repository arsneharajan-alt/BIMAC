import type { ProductMark } from "@/types";

/**
 * The software axis as navigation.
 *
 * `software.ts` holds the platforms BIMAC has authored an automation scope for
 * — those have their own page. The header menu has to cover the whole stack
 * shown on the "Our Tools" board, including the applications we work in but
 * have not written a capability page for yet.
 *
 * So each entry either carries a `slug` (it has a page) or not (it anchors to
 * its tile in the "Also in the stack" grid on /software). Nothing in the menu
 * points at a route that does not exist, and every logo on the board has a
 * place on the site.
 *
 * Every entry carries a mark so the menu reads as logos rather than a list of
 * words — the vendor's own SVG where one is on file under /public/logos, and
 * otherwise the initials tile in that product's colour, exactly as the
 * platform pages already do. See public/logos/README.md.
 *
 * Four columns, same shape as the Products mega menu: category first, then the
 * applications inside it, so a visitor scans by the kind of work they do
 * rather than by vendor.
 */

export interface SoftwareMenuItem {
  /** Stable id; also the anchor id on /software for platforms without a page. */
  id: string;
  label: string;
  /** Full product name, used as the logo's alt text. */
  name: string;
  vendor: string;
  /** Where the application sits in the design → handover chain. */
  role: string;
  /** Set when the platform has its own authored page under /software. */
  slug?: string;
  /** Vendor artwork under /public/logos. */
  logo?: string;
  /** The logo is a wordmark rather than a square icon — ETABS, SAP2000. */
  logoWide?: boolean;
  /** Fallback artwork — initials in the product's colour. */
  mark: ProductMark;
}

export interface SoftwareMenuColumn {
  id: string;
  title: string;
  items: SoftwareMenuItem[];
}

export const softwareMenuColumns: SoftwareMenuColumn[] = [
  {
    id: "design",
    title: "Design & Modelling",
    items: [
      {
        id: "revit",
        label: "Revit",
        name: "Autodesk Revit",
        vendor: "Autodesk",
        role: "Modelling & documentation",
        slug: "revit",
        logo: "/logos/revit.png",
        mark: { letters: "R", color: "#0696D7" },
      },
      {
        id: "autocad",
        label: "AutoCAD",
        name: "Autodesk AutoCAD",
        vendor: "Autodesk",
        role: "2D drawing production",
        slug: "autocad",
        logo: "/logos/autocad.png",
        mark: { letters: "A", color: "#D8261C" },
      },
      {
        id: "archicad",
        label: "Archicad",
        name: "Graphisoft Archicad",
        vendor: "Graphisoft",
        role: "Architectural BIM authoring",
        logo: "/logos/archicad.png",
        logoWide: true,
        mark: { letters: "AC", color: "#0E7C86" },
      },
      {
        id: "sketchup",
        label: "SketchUp",
        name: "Trimble SketchUp",
        vendor: "Trimble",
        role: "Concept & massing",
        logo: "/logos/sketchup.png",
        mark: { letters: "SU", color: "#005F9E" },
      },
      {
        id: "civil-3d",
        label: "Civil 3D",
        name: "Autodesk Civil 3D",
        vendor: "Autodesk",
        role: "Site & infrastructure design",
        logo: "/logos/civil-3d.png",
        mark: { letters: "C3", color: "#CE1F7B" },
      },
      {
        id: "infraworks",
        label: "Infraworks",
        name: "Autodesk Infraworks",
        vendor: "Autodesk",
        role: "Conceptual infrastructure",
        logo: "/logos/infraworks.png",
        mark: { letters: "IW", color: "#8E2C9A" },
      },
      {
        id: "3ds-max",
        label: "3ds Max",
        name: "Autodesk 3ds Max",
        vendor: "Autodesk",
        role: "Visualisation & animation",
        logo: "/logos/3ds-max.png",
        mark: { letters: "3D", color: "#1CA3DE" },
      },
      {
        id: "render",
        label: "Rendering",
        name: "Rendering & visualisation",
        vendor: "Enscape, V-Ray, Lumion",
        role: "Presentation output",
        logo: "/logos/render.png",
        mark: { letters: "RN", color: "#E8762C" },
      },
    ],
  },
  {
    id: "structural",
    title: "Structural Analysis",
    items: [
      {
        id: "etabs",
        label: "ETABS",
        name: "ETABS",
        vendor: "Computers & Structures, Inc.",
        role: "Structural analysis & design",
        slug: "etabs",
        logo: "/logos/etabs.png",
        logoWide: true,
        mark: { letters: "ET", color: "#1F4E79" },
      },
      {
        id: "staad-pro",
        label: "Staad.Pro",
        name: "Bentley Staad.Pro",
        vendor: "Bentley",
        role: "Structural analysis",
        logo: "/logos/staad-pro.png",
        mark: { letters: "SP", color: "#1F5FA8" },
      },
      {
        id: "sap2000",
        label: "Sap2000",
        name: "Sap2000",
        vendor: "Computers & Structures, Inc.",
        role: "General structural analysis",
        logo: "/logos/sap2000.png",
        logoWide: true,
        mark: { letters: "S2", color: "#3F6E8C" },
      },
      {
        id: "tekla",
        label: "Tekla Structures",
        name: "Trimble Tekla Structures",
        vendor: "Trimble",
        role: "Detailing & fabrication",
        logo: "/logos/tekla.png",
        logoWide: true,
        mark: { letters: "TS", color: "#0077C8" },
      },
    ],
  },
  {
    id: "coordination",
    title: "Coordination & Review",
    items: [
      {
        id: "navisworks",
        label: "Navisworks",
        name: "Autodesk Navisworks",
        vendor: "Autodesk",
        role: "Coordination & clash",
        slug: "navisworks",
        logo: "/logos/navisworks.png",
        mark: { letters: "N", color: "#0E9C8E" },
      },
      {
        id: "solibri",
        label: "Solibri",
        name: "Solibri Office",
        vendor: "Nemetschek",
        role: "Model checking & QA",
        logo: "/logos/solibri.png",
        mark: { letters: "S", color: "#FFC72C", onColor: "#1A1A1A" },
      },
      {
        id: "synchro-4d",
        label: "Synchro 4D",
        name: "Bentley Synchro 4D",
        vendor: "Bentley",
        role: "4D construction sequencing",
        logo: "/logos/synchro-4d.png",
        mark: { letters: "S4", color: "#1C6EA4" },
      },
      {
        id: "planswift",
        label: "Planswift",
        name: "Planswift",
        vendor: "ConstructConnect",
        role: "Quantity takeoff",
        logo: "/logos/planswift.png",
        logoWide: true,
        mark: { letters: "PS", color: "#3E5C76" },
      },
    ],
  },
  {
    id: "data",
    title: "Data & Planning",
    items: [
      {
        id: "primavera",
        label: "Primavera P6",
        name: "Oracle Primavera P6",
        vendor: "Oracle",
        role: "Planning & scheduling",
        slug: "primavera-p6",
        logo: "/logos/primavera-p6.png",
        mark: { letters: "P6", color: "#C74634" },
      },
      {
        id: "ms-project",
        label: "MS Project",
        name: "Microsoft Project",
        vendor: "Microsoft",
        role: "Project management",
        slug: "ms-project",
        logo: "/logos/ms-project.svg",
        mark: { letters: "P", color: "#31752F" },
      },
      {
        id: "power-bi",
        label: "Power BI",
        name: "Microsoft Power BI",
        vendor: "Microsoft",
        role: "Reporting & dashboards",
        slug: "power-bi",
        logo: "/logos/power-bi.png",
        mark: { letters: "BI", color: "#F2C811", onColor: "#0C1015" },
      },
      {
        id: "excel",
        label: "Microsoft Excel",
        name: "Microsoft Excel",
        vendor: "Microsoft",
        role: "Calculation & data",
        slug: "excel",
        logo: "/logos/excel.png",
        mark: { letters: "X", color: "#217346" },
      },
      {
        id: "word",
        label: "Microsoft Word",
        name: "Microsoft Word",
        vendor: "Microsoft",
        role: "Reports & submittals",
        logo: "/logos/word.png",
        mark: { letters: "W", color: "#2B579A" },
      },
    ],
  },
];

/** A platform page when one exists, otherwise its tile on the software index. */
export function softwareMenuHref(item: SoftwareMenuItem): string {
  return item.slug ? `/software/${item.slug}` : `/software#sw-${item.id}`;
}

/** The applications we work in that do not have an authored page yet. */
export const additionalSoftware: SoftwareMenuItem[] = softwareMenuColumns
  .flatMap((column) => column.items)
  .filter((item) => !item.slug);
