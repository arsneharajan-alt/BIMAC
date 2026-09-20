import type { CSSProperties } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import { GLOSS, LIFT, Sheen } from "@/components/ui/Gloss";
import DisciplineSolid, { type SolidId } from "./DisciplineSolid";
import type { DisciplineId } from "@/types";

/**
 * What we automate — the three ways in.
 *
 * Three cards and nothing else. Each is a door to the products that already
 * exist on /tools/<discipline>, so no product content is repeated here: a
 * name, three words for what the tools do, and the solid.
 *
 * The solid sits on the right of the card and runs past its edge, which is
 * what stops three cards of mostly white space reading as empty.
 */
const ENTRIES: {
  id: DisciplineId;
  solid: SolidId;
  label: string;
  tagline: string;
  href: string;
}[] = [
  {
    id: "architecture",
    solid: "architecture",
    label: "Architecture",
    tagline: "Design. Model. Automate.",
    href: "/tools/architecture",
  },
  {
    id: "structure",
    solid: "structure",
    label: "Structures",
    tagline: "Analyze. Detail. Deliver.",
    href: "/tools/structure",
  },
  {
    id: "mep",
    solid: "mep",
    label: "MEP",
    tagline: "Coordinate. Automate. Build.",
    href: "/tools/mep",
  },
];

export function WhatWeAutomated() {
  return (
    <section className="border-b border-ink-200 bg-white py-20 sm:py-28">
      <Container>
        <div data-reveal="" className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <p className="flex items-center gap-2.5 text-[0.8125rem] font-semibold uppercase tracking-[0.13em] text-brand-600">
              <span className="h-px w-6 bg-brand-500" />
              What we automate
            </p>
            <h2 className="mt-5 font-display text-[2rem] font-semibold leading-[1.08] tracking-tightest text-ink-950 sm:text-[2.6rem]">
              Key Disciplines. <span className="text-brand-500">Real Impact.</span>
            </h2>
          </div>

          <p className="max-w-[34ch] text-pretty text-[0.9375rem] leading-relaxed text-ink-500 lg:text-right">
            Automate your workflow across core AEC disciplines. Click a discipline to explore our
            products.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {ENTRIES.map((entry, index) => (
            <Link
              key={entry.id}
              href={entry.href}
              data-reveal=""
              style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
              className={`group relative isolate flex min-h-[16.5rem] flex-col justify-between overflow-hidden rounded-2xl border border-ink-200 bg-[linear-gradient(168deg,#FFFFFF_0%,#F6F9FC_100%)] p-6 ${GLOSS} ${LIFT} hover:border-brand-300`}
            >
              {/* The solid, right of the type and running past the card edge. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-7 bottom-1 top-1 w-[68%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              >
                <DisciplineSolid id={entry.solid} />
              </span>

              <div className="relative max-w-[12rem]">
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink-950">
                  {entry.label}
                </h3>
                <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-500">{entry.tagline}</p>
              </div>

              <span className="relative grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white text-ink-600 transition-colors duration-300 group-hover:border-brand-300 group-hover:bg-brand-500 group-hover:text-white">
                <Icon name="arrow-right" className="text-sm" />
              </span>

              <Sheen />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default WhatWeAutomated;
