import type { NavLink } from "@/types";

/**
 * Site configuration and contact routing.
 *
 * There is no checkout at this stage — every commercial action routes to
 * WhatsApp or email, with the tool name carried through so an enquiry arrives
 * already telling you which plugin it is about.
 */

export const site = {
  name: "BIMAC",
  legalName: "BIM Automation Consulting",
  tagline: "BIM Automation Tools for Architecture, Structure and MEPF",
  description:
    "BIMAC builds BIM automation plugins for architecture, structure and MEPF — from the site study and concept design through detailed design, documentation and coordination to as-built handover.",
  url: "https://www.bimautomationconsulting.com",
  email: "info@bimautomationconsulting.com",
  phoneDisplay: "+971 50 605 5153",
  /** Digits only, with country code — required by the wa.me link format. */
  whatsapp: "971506055153",
  founded: 2025,
};

/**
 * Delivery record.
 *
 * Only figures that are actually true belong here. Anything left `null` is
 * simply not rendered, so the site never claims a number BIMAC cannot stand
 * behind. Fill these in from real project records before launch.
 */
export const impact = {
  /** Projects delivered using BIMAC automation. Shown as "7+". */
  projectsCompleted: 7,

  /**
   * Typical time saved against manual production, on the tasks that get
   * automated. Derived from the turnaround below: a five-day working week
   * compressed into one day is an 80% reduction. Change both together if
   * that ratio is not right.
   */
  averageTimeReduction: "80%" as string | null,

  /** A representative before/after that a client would recognise. */
  representativeTurnaround: "1 week → 1 day" as string | null,

  /** e.g. 1200 — total production hours recovered. Left off until counted. */
  hoursSaved: null as number | null,
};

/**
 * WhatsApp deep link with the enquiry pre-filled.
 *
 * There is no checkout yet, so "Buy" is a conversation too — but it should not
 * arrive worded like a question. `intent: "buy"` sends someone who has already
 * decided, which is worth knowing at the other end of the thread.
 */
export function whatsappLink(
  context?: string,
  intent: "enquire" | "buy" | "demo" = "enquire",
): string {
  const message =
    intent === "buy" && context
      ? `Hello BIMAC, I'd like to buy ${context}. Could you send pricing and the next steps?`
      : intent === "demo" && context
        ? `Hello BIMAC, I'd like to book a demo of ${context}. When are you free?`
        : context
          ? `Hello BIMAC, I'd like to know more about ${context}.`
          : "Hello BIMAC, I'd like to know more about your BIM automation tools.";
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** mailto with the tool name in the subject, so enquiries self-sort. */
export function emailLink(context?: string): string {
  const subject = context ? `Enquiry — ${context}` : "BIMAC enquiry";
  const body = context
    ? `Hello,\n\nI'd like to know more about ${context}.\n\n`
    : "Hello,\n\nI'd like to know more about your BIM automation tools.\n\n";
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const primaryNav: NavLink[] = [
  { label: "Products", href: "/tools" },
  { label: "Architecture", href: "/tools/architecture" },
  { label: "Structure", href: "/tools/structure" },
  { label: "MEP", href: "/tools/mep" },
  { label: "Custom Automation", href: "/custom-automation" },
  { label: "About", href: "/about" },
];

/** Links shown in the header bar; the rest live in the Products mega menu. */
export const headerNav: NavLink[] = [
  { label: "Products", href: "/tools" },
  { label: "Software", href: "/software" },
  { label: "Custom Automation", href: "/custom-automation" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Architecture",
    links: [
      { label: "All architecture tools", href: "/tools/architecture" },
      { label: "Revit add-ins", href: "/software/revit#architecture" },
      { label: "AutoCAD add-ins", href: "/software/autocad#architecture" },
    ],
  },
  {
    title: "Structure",
    links: [
      { label: "All structure tools", href: "/tools/structure" },
      { label: "Revit add-ins", href: "/software/revit#structure" },
      { label: "AutoCAD add-ins", href: "/software/autocad#structure" },
    ],
  },
  {
    title: "MEP",
    links: [
      { label: "All mep tools", href: "/tools/mep" },
      { label: "Revit add-ins", href: "/software/revit#mep" },
      { label: "AutoCAD add-ins", href: "/software/autocad#mep" },
    ],
  },
  {
    title: "Software",
    links: [
      { label: "All software", href: "/software" },
      { label: "Revit", href: "/software/revit" },
      { label: "AutoCAD", href: "/software/autocad" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "All tools", href: "/tools" },
      { label: "Projects", href: "/projects" },
      { label: "Automation by software", href: "/software" },
    ],
  },
  {
    /* The footer puts the WhatsApp and Email buttons under this column. */
    title: "Custom",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  /* Privacy and Terms live in the footer's bottom bar, not as a column. */
];

export const searchSuggestions: string[] = [
  "massing",
  "CAD to Revit",
  "sprinkler",
  "load calculation",
  "annotation",
  "point list",
  "shop drawings",
  "as-built",
];
