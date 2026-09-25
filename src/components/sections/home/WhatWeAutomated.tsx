import type { CSSProperties } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import StackedHeading from "@/components/ui/StackedHeading";
import { GLOSS, LIFT, Sheen } from "@/components/ui/Gloss";
import { cn } from "@/lib/utils";
import DisciplineSolid, { type SolidId } from "./DisciplineSolid";
import type { DisciplineId } from "@/types";

/**
 * The three disciplines.
 *
 * Each card is a door to /tools/<discipline>, and now says what is behind it:
 * the four kinds of work the plugins take over in that discipline. The solid
 * model stays as the card's picture.
 *
 * One design, three accents. Orange, azure and teal are the same three colours
 * the example automations use for architecture, structure and MEP, so the
 * disciplines are told apart the same way everywhere on the page.
 */

type Accent = { bar: string; text: string; tint: string; ring: string; check: string };

const ACCENTS: Record<DisciplineId, Accent> = {
  architecture: {
    bar: "bg-brand-500",
    text: "text-brand-600",
    tint: "from-brand-50",
    ring: "hover:border-brand-300",
    check: "bg-brand-50 text-brand-600",
  },
  structure: {
    bar: "bg-azure-500",
    text: "text-azure-600",
    tint: "from-azure-50",
    ring: "hover:border-azure-300",
    check: "bg-azure-50 text-azure-600",
  },
  mep: {
    bar: "bg-teal-500",
    text: "text-teal-600",
    tint: "from-teal-50",
    ring: "hover:border-teal-300",
    check: "bg-teal-50 text-teal-600",
  },
} as Record<DisciplineId, Accent>;

const ENTRIES: {
  id: DisciplineId;
  solid: SolidId;
  label: string;
  line: string;
  work: string[];
  href: string;
}[] = [
  {
    id: "architecture",
    solid: "architecture",
    label: "Architecture",
    line: "The repetitive half of design — modelling, documentation and sheets — handled.",
    work: ["Rooms, walls & floors from CAD", "Sheets, views & title blocks", "Area & room schedules", "Tagging & annotation"],
    href: "/tools/architecture",
  },
  {
    id: "structure",
    solid: "structure",
    label: "Structure",
    line: "Models, drawings and data that stay in step as the design moves.",
    work: ["Grids, columns & framing from CAD", "GA & detail drawing sets", "Quantities & take-offs", "Model QA & standards checks"],
    href: "/tools/structure",
  },
  {
    id: "mep",
    solid: "mep",
    label: "MEP",
    line: "Mechanical, electrical and plumbing, modelled and documented at speed.",
    work: ["Duct, pipe & tray routing", "Equipment layout & tagging", "Schematics & system schedules", "Coordination & clash reports"],
    href: "/tools/mep",
  },
];

export function WhatWeAutomated() {
  return (
    <section className="border-b border-ink-200 bg-white py-14 sm:py-20">
      <Container>
        <StackedHeading
          eyebrow="Disciplines"
          title="Architecture. Structure. MEP."
          accent="Automated End to End."
          lede="Every plugin is built around the way one discipline actually works. Pick yours to explore the catalogue."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3 lg:mt-12">
          {ENTRIES.map((entry, index) => {
            const accent = ACCENTS[entry.id];
            return (
              <Link
                key={entry.id}
                href={entry.href}
                data-reveal=""
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
                className={cn(
                  "group relative isolate flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white",
                  GLOSS,
                  LIFT,
                  accent.ring,
                )}
              >
                {/* The discipline's colour, along the top edge. */}
                <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 z-10 h-1", accent.bar)} />

                {/* The model, on a wash of the discipline's colour. */}
                <div className={cn("relative h-44 overflow-hidden bg-gradient-to-b to-white", accent.tint)}>
                  <span aria-hidden="true" className="absolute inset-0 bg-grid-light bg-grid opacity-50" />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-10 bottom-0 top-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  >
                    <DisciplineSolid id={entry.solid} />
                  </span>
                  <span className={cn("absolute left-6 top-5 font-mono text-[0.75rem] font-semibold tracking-wider", accent.text)}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 pt-5">
                  <h3 className="font-display text-card-title font-semibold text-ink-950 lg:text-card-title-lg">
                    {entry.label}
                  </h3>
                  <span aria-hidden="true" className={cn("mt-3 block h-[3px] w-7 rounded-full", accent.bar)} />
                  <p className="mt-4 text-card-body text-ink-500">{entry.line}</p>

                  <ul className="mt-5 space-y-2.5">
                    {entry.work.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-card-meta font-medium text-ink-700">
                        <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full", accent.check)}>
                          <Icon name="check" className="text-[0.625rem]" strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <span className={cn("mt-auto inline-flex items-center gap-1.5 pt-6 text-[0.875rem] font-semibold", accent.text)}>
                    Explore {entry.label} plugins
                    <Icon name="arrow-right" className="text-[0.8rem] transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>

                <Sheen />
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default WhatWeAutomated;
