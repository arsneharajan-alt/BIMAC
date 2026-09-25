# BIMAC — BIM Automation Tools

A catalogue site for BIM automation plugins across **Architecture, Structure, MEP** and shared
**BIM & Revit** automation, organised the way a customer thinks:

```
Discipline  →  Group  →  Tool          (primary navigation)
Project stage                          (secondary axis: concept → handover)
Host software                          (a filter, never the hierarchy)
```

There is **no checkout**. Every commercial action routes to WhatsApp or email with the tool
name carried through, so an enquiry arrives already saying which plugin it is about.

## Running it

Node.js is installed at `%LOCALAPPDATA%\Programs\nodejs` (portable, user-scope) and is on your
user PATH.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

Stop the dev server before running `npm run build` — both use `.next`.

## Things to keep current

### 1. Tool availability status

Currently **36 available · 15 in development · 22 planned** (73 total). Availability is driven
by two id sets at the top of `src/data/tools.ts`:

```ts
const AVAILABLE = new Set<string>([ "ai-massing", ... ]);
const IN_DEVELOPMENT = new Set<string>([ "rcp-detailing", ... ]);
// anything in neither set is "planned"
```

Move an id between the sets and every count on the site re-derives — the dashboard band, the
filter sidebar, the discipline hubs, and the card badges. There is no separate number to keep
in sync.

### 2. Delivery record

Shown on the homepage dashboard and the About page, set in `src/lib/site.ts`:

```ts
export const impact = {
  projectsCompleted: 17,
  averageTimeReduction: "80%",           // a 5-day week compressed to 1 day
  representativeTurnaround: "1 week → 1 day",
  hoursSaved: null,                      // null = tile not rendered
};
```

Keep `averageTimeReduction` and `representativeTurnaround` consistent with each other. Any
field left `null` is simply not displayed.

### 3. Demo videos

Every tool currently has `video: { kind: "none" }`, which renders the drawn interface preview
plus an honest "ask for a live demo" note. To publish a real demo:

```ts
video: { kind: "youtube", id: "dQw4w9WgXcQ", duration: "1:24" }
video: { kind: "vimeo",   id: "123456789" }
video: { kind: "file",    id: "/videos/massing-demo.mp4", poster: "/videos/massing.jpg" }
```

The player replaces the preview automatically. Self-hosted files go in `public/videos/`.

### 4. Contact details

Set once in `src/lib/site.ts` and used everywhere:

```ts
email:        "info@bimautomationconsulting.com"
phoneDisplay: "+971 50 605 5153"
whatsapp:     "971506055153"   // digits only, with country code
```

## Adding a tool

Tools are **not** hardcoded into pages. Add one object to `src/data/tools.ts` and it appears in
the catalogue, its discipline hub (in the right group section), its stage page, search, related
lists, the sitemap, and its own page at `/tools/{discipline}/{slug}`.

```ts
{
  id: "my-tool",
  name: "My Tool",
  slug: "my-tool",
  disciplines: ["architecture"],   // first entry owns the URL
  group: "documentation",          // must match a group id on that discipline
  stage: "documentation",
  software: ["revit"],
  summary: "One line for the card.",
  description: "Two or three sentences for the tool hero.",
  what: ["Paragraph one.", "Paragraph two."],
  features: ["...", "..."],
  inputs: ["..."],
  outputs: ["..."],
  glyph: "file-text",
  mockup: "table",
}
```

**Multi-discipline tools are one product, not many.** `CAD-to-Revit Automation` lists seven
disciplines, so it appears on all seven hubs and carries seven badges — but has a single page,
a single version, and a single demo. `Scan-to-BIM Automation` works the same way.

## Catalogue shape

| Discipline | Groups |
| --- | --- |
| Architecture | Concept & Planning · Modeling · Design & Detailing · Documentation · QA/QC |
| Structure | Modeling · Detailing · Documentation · Data & Quantities · QA/QC |
| Mechanical / Electrical / Plumbing / Fire Fighting | Conversion · Modeling · Layout & Routing · Documentation · Quantities · QA/QC |
| BIM & Revit | Project & Model Management · BIM Conversion · Data & Documentation · Coordination · Export & Deliverables · Project Completion |

Project stages: Concept & Planning → Modeling & Conversion → Design & Detailing →
Documentation → Coordination & QA/QC → Quantities & Cost → As-Built & Handover.

## Routes

```
/                                   home — "What do you work with?" first
/tools                              full catalogue (discipline tabs + filters)
/tools/architecture                 discipline hubs, grouped by workflow
/tools/structure
/tools/mep                          family hub — links to the four services
/tools/mechanical  /tools/electrical  /tools/plumbing  /tools/fire-fighting
/tools/bim-revit
/tools/[discipline]/[tool]          tool detail
/stages                             lifecycle overview
/stages/[stage]                     every tool at that stage, all disciplines
/custom-development                 bespoke builds
/about  /contact  /search           
/privacy-policy  /terms
/sitemap.xml                        generated from the data layer
```

## Project structure

```
src/
├── app/                  routes only — pages compose components, they hold no data
├── components/
│   ├── ui/               Button, Badge, Icon, Accordion, Breadcrumbs, SectionHeading
│   ├── layout/           Header, MegaMenu, MobileNav, SearchOverlay, Footer
│   ├── common/           Logo, HeroVisual, AppMockup, ProductGlyph, ContactActions
│   ├── marketplace/      Catalogue, ToolCard, ToolGrid, ToolFilters, DisciplineTabs
│   ├── tool/             ToolHero, ToolDemo, ToolSections
│   └── sections/         Hero, HomeSections
├── data/                 disciplines · stages · tools   ← the whole catalogue
├── lib/                  site config + contact links, filtering, search index
└── types/                the domain model
```

## Deliberately not included

Payments, checkout, cart, accounts, login. Also removed during the restructure, because they
were placeholder content that would have been fabricated social proof for a new practice:
customer reviews, star ratings, download counts, invented prices, and case studies with named
clients. Add them back only when they are real.

## Visual identity

Original to BIMAC. Brand orange `#F55F16` with a full 50–950 scale, graphite `ink` neutrals for
an AEC rather than SaaS feel. **No stock imagery** — the hero is a drawn isometric structural
model on a 30° projection, and every tool "screenshot" is a drawn interface (`AppMockup`) in one
of five layouts.
