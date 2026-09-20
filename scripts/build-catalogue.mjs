/**
 * Build the tool catalogue from the designed cards.
 *
 * Every product BIMAC sells has a card, and the card already carries its name,
 * the sentence under it and the four steps it runs through. Keeping a separate
 * hand-written catalogue beside 112 of those is how the two drift apart — a
 * card saying "Site & Feasibility" while the site says "Site & Massing" is the
 * kind of thing nobody sees until a customer does.
 *
 * So the catalogue is generated from the cards, and the only hand-written part
 * is `SUMMARIES` below: the one-line descriptions supplied for the Revit tools,
 * which are the sentences the back of each card shows. Anything without one
 * falls back to the card's own subhead.
 *
 *   node scripts/build-catalogue.mjs && node scripts/build-cards.mjs
 *
 * Ids are built from the path — revit/architecture/07-schedule.html becomes
 * `revit-arch-schedule` — so a tool that appears under two applications stays
 * two products with two cards, which is what they are.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const CARDS = "cards";
const OUT = join("src", "data", "catalogue");

const SOFTWARE = { revit: "revit", autocad: "autocad" };
const DISCIPLINES = ["architecture", "structure", "mep"];
const SHORT = { architecture: "arch", structure: "str", mep: "mep" };

/**
 * The sentences supplied for the Revit line-ups, keyed by id.
 *
 * These are the product descriptions as written, not as inferred, and they win
 * over the card's own subhead wherever both exist.
 */
const SUMMARIES = JSON.parse(readFileSync(join("scripts", "summaries.json"), "utf8"));

/** Which tools are still to be built, so the card is a placeholder. */
const PLANNED = new Set(JSON.parse(readFileSync(join("scripts", "planned.json"), "utf8")));

const text = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

/** Everything the site needs about one card. */
function read(software, discipline, file) {
  const html = readFileSync(join(CARDS, software, discipline, file), "utf8");

  const title = text((html.match(/<title>([^<]*)<\/title>/) ?? [, file])[1]);
  const subhead = text((html.match(/<h2 style="[^"]*">([\s\S]*?)<\/h2>/) ?? [, ""])[1]);

  const steps = [...html.matchAll(/font-size: 15px; font-weight: 600; color: #16181C;">([^<]*)</g)]
    .map((m) => text(m[1]))
    .slice(0, 4);

  const order = Number(file.slice(0, 2));
  const slug = basename(file, ".html").replace(/^\d+-/, "");
  const id = `${software === "revit" ? "revit" : "acad"}-${SHORT[discipline]}-${slug}`;

  return { id, slug, order, title, subhead, steps, software, discipline };
}

const GROUP = {
  architecture: "documentation",
  structure: "documentation",
  mep: "documentation",
};

const q = (v) => JSON.stringify(v);

function entry(card, index) {
  const summary = SUMMARIES[card.id] ?? card.subhead;
  const steps = card.steps.length ? card.steps : ["Set it up", "Run it", "Check it", "Issue it"];
  const planned = PLANNED.has(card.id);

  const lines = [
    `    id: ${q(card.id)},`,
    `    name: ${q(card.title)},`,
    `    slug: ${q(card.id)},`,
    `    disciplines: [${q(card.discipline)}],`,
    `    group: ${q(GROUP[card.discipline])},`,
    `    stage: "documentation",`,
    `    software: [${q(SOFTWARE[card.software])}],`,
    `    glyph: "layers",`,
    `    mockup: "viewer",`,
    `    status: ${q(planned ? "planned" : "available")},`,
    `    summary:\n      ${q(summary)},`,
    `    description:\n      ${q(card.subhead || summary)},`,
    `    what: [\n      ${q(`What it runs through, in order: ${steps.join(", ").toLowerCase()}.`)},\n      ${q(
      "Every one of those is a step somebody does by hand today, on every drawing of every job.",
    )},\n    ],`,
    `    features: [\n${steps.map((s) => `      ${q(s)},`).join("\n")}\n    ],`,
    `    inputs: [${q("Project model or drawing set")}, ${q("The office standard it follows")}],`,
    `    outputs: [${q("The work, done")}, ${q("A log of what it produced")}],`,
  ];

  const n = index + 1;
  return `  /* ${n} ${"-".repeat(Math.max(4, 64 - String(n).length))} */\n  {\n${lines.join("\n")}\n  },\n`;
}

for (const discipline of DISCIPLINES) {
  const cards = [];
  for (const software of Object.keys(SOFTWARE)) {
    const dir = join(CARDS, software, discipline);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir).filter((f) => f.endsWith(".html")).sort();
    for (const file of files) cards.push(read(software, discipline, file));
  }

  const name = discipline === "mep" ? "mep" : discipline;
  const varName = `${name}Tools`;
  const lineName = `${name}Lineup`;

  const byRevit = cards.filter((c) => c.software === "revit").length;
  const byCad = cards.length - byRevit;

  writeFileSync(
    join(OUT, `${name}.ts`),
    `import type { ToolSeed } from "./shared";

/**
 * ${discipline[0].toUpperCase() + discipline.slice(1)} — ${cards.length} products: ${byRevit} Revit add-ins and ${byCad} for AutoCAD.
 *
 * Generated by scripts/build-catalogue.mjs from the cards in cards/ — do not
 * edit. Every name, sentence and step comes off the card that shows it, so the
 * page and the animation can never drift apart. The one hand-written input is
 * scripts/summaries.json, which holds the supplied product descriptions.
 *
 * A tool that exists for both applications is two products here, because it is
 * two products: different work, different card, different add-in.
 */
export const ${varName}: ToolSeed[] = [
${cards.map(entry).join("\n")}];

/**
 * The cards, in the order they appear on the hub: Revit first, then AutoCAD,
 * each in the order they were drawn. The hub groups them by application and
 * numbers them off this array.
 */
export const ${lineName}: string[] = [
${cards.map((c) => `  ${q(c.id)},`).join("\n")}
];
`,
  );

  console.log(`${discipline.padEnd(13)} ${String(cards.length).padStart(3)} tools  (revit ${byRevit}, autocad ${byCad})`);
}
