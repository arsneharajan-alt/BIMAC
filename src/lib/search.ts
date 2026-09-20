import { disciplineFamilies, disciplines } from "@/data/disciplines";
import { softwarePlatforms } from "@/data/software";
import { toolHref, tools } from "@/data/tools";
import type { SearchResult } from "@/types";

/**
 * Global search index, built from the same data the pages render.
 *
 * A search for "sprinkler" returns the sprinkler tools and the Fire Fighting
 * discipline; "massing" returns the massing generator and its discipline.
 */

interface IndexEntry extends Omit<SearchResult, "score"> {
  primary: string;
  secondary: string;
}

const staticPages: IndexEntry[] = [
  {
    kind: "page",
    title: "All tools",
    description: "Browse every BIMAC tool by discipline, software, and availability.",
    href: "/tools",
    glyph: "grid",
    primary: "tools all catalogue browse plugins",
    secondary: "marketplace list automation revit",
  },
  {
    kind: "page",
    title: "Automation by software",
    description:
      "What BIMAC automates in Revit, AutoCAD, Navisworks, Excel, Power BI, Primavera P6, ETABS and MS Project.",
    href: "/software",
    glyph: "package",
    primary: "software platforms applications by software",
    secondary: "revit autocad navisworks excel power bi primavera p6 etabs ms project host",
  },
  {
    kind: "page",
    title: "Custom Automation",
    description: "Bespoke plugins and automation built for your specific workflow.",
    href: "/custom-automation",
    glyph: "code",
    primary: "custom automation development bespoke build",
    secondary: "quote consulting tailored plugin request",
  },
  {
    kind: "page",
    title: "About BIMAC",
    description: "Who builds these tools and how they are developed.",
    href: "/about",
    glyph: "users",
    primary: "about company who",
    secondary: "team background approach",
  },
  {
    kind: "page",
    title: "Contact",
    description: "Reach BIMAC on WhatsApp or by email.",
    href: "/contact",
    glyph: "mail",
    primary: "contact whatsapp email enquiry demo",
    secondary: "get in touch message phone reach",
  },
];

const index: IndexEntry[] = [
  ...tools.map<IndexEntry>((tool) => ({
    kind: "tool",
    title: tool.name,
    description: tool.summary,
    href: toolHref(tool),
    meta: tool.disciplines
      .slice(0, 2)
      .map((id) => disciplines.find((d) => d.id === id)?.shortName ?? id)
      .join(" · "),
    glyph: tool.glyph,
    primary: `${tool.name} ${tool.slug}`,
    secondary: [
      tool.summary,
      tool.description,
      tool.group,
      tool.stage,
      ...tool.disciplines,
      ...tool.software,
      ...tool.features,
      ...tool.inputs,
      ...tool.outputs,
    ].join(" "),
  })),
  ...disciplines.map<IndexEntry>((discipline) => ({
    kind: "discipline",
    title: `${discipline.shortName} tools`,
    description: discipline.tagline,
    href: `/tools/${discipline.slug}`,
    meta: "Discipline",
    glyph: discipline.glyph,
    primary: `${discipline.name} ${discipline.shortName} ${discipline.slug}`,
    secondary: `${discipline.tagline} ${discipline.audience} ${discipline.groups
      .map((group) => group.name)
      .join(" ")}`,
  })),
  ...disciplineFamilies
    .filter((family) => family.id === "mep")
    .map<IndexEntry>((family) => ({
      kind: "discipline",
      title: `${family.name} tools`,
      description: family.tagline,
      href: `/tools/${family.slug}`,
      meta: "Discipline group",
      glyph: family.glyph,
      primary: `${family.name} ${family.slug} mechanical electrical plumbing fire`,
      secondary: family.tagline,
    })),
  ...softwarePlatforms.map<IndexEntry>((platform) => ({
    kind: "software",
    title: `${platform.shortName} automation`,
    description: platform.tagline,
    href: `/software/${platform.slug}`,
    meta: platform.role,
    glyph: platform.glyph,
    primary: `${platform.name} ${platform.shortName} ${platform.slug}`,
    // Every capability name, so a search for "bar bending" lands on AutoCAD.
    secondary: [
      platform.vendor,
      platform.role,
      platform.tagline,
      platform.description,
      ...platform.groups.flatMap((group) => [group.name, ...group.capabilities]),
    ].join(" "),
  })),
  ...staticPages,
];

const kindWeight: Record<SearchResult["kind"], number> = {
  tool: 3,
  discipline: 2.2,
  software: 2,
  page: 1,
};

function scoreEntry(entry: IndexEntry, tokens: string[]): number {
  const primary = entry.primary.toLowerCase();
  const secondary = entry.secondary.toLowerCase();
  let score = 0;

  for (const token of tokens) {
    if (primary.startsWith(token)) score += 12;
    else if (primary.includes(token)) score += 8;
    else if (secondary.includes(token)) score += 3;
    else return 0; // every token must appear somewhere
  }

  return score * kindWeight[entry.kind];
}

export function search(query: string, limit = 12): SearchResult[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  return index
    .map((entry) => {
      const { primary, secondary, ...result } = entry;
      void primary;
      void secondary;
      return { ...result, score: scoreEntry(entry, tokens) };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export function groupResults(results: SearchResult[]) {
  const order: SearchResult["kind"][] = [
    "tool",
    "discipline",
    "software",
    "page",
  ];
  const labels: Record<SearchResult["kind"], string> = {
    tool: "Tools",
    discipline: "Disciplines",
    software: "Software",
    page: "Pages",
  };

  return order
    .map((kind) => ({
      kind,
      label: labels[kind],
      results: results.filter((result) => result.kind === kind),
    }))
    .filter((group) => group.results.length > 0);
}
