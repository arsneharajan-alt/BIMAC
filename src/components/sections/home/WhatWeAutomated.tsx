import type { CSSProperties } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import StackedHeading from "@/components/ui/StackedHeading";
import { GLOSS, LIFT, Sheen } from "@/components/ui/Gloss";
import type { DisciplineId } from "@/types";

/**
 * The three disciplines, kept to the approved design: a name, three words,
 * a way in, and the model.
 *
 * Each card is a door to /tools/<discipline>. The model on the right is the
 * render from the approved design, used as it is, on the soft grey it was
 * rendered on and feathered at the edges so it has no visible frame.
 */
const ENTRIES: { id: DisciplineId; label: string; tagline: string; href: string }[] = [
  { id: "architecture", label: "Architecture", tagline: "Design. Model. Automate.", href: "/tools/architecture" },
  { id: "structure", label: "Structure", tagline: "Analyze. Detail. Deliver.", href: "/tools/structure" },
  { id: "mep", label: "MEP", tagline: "Coordinate. Automate. Build.", href: "/tools/mep" },
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
          {ENTRIES.map((entry, index) => (
            <Link
              key={entry.id}
              href={entry.href}
              data-reveal=""
              style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
              className={`group relative isolate flex min-h-[16.5rem] flex-col justify-between overflow-hidden rounded-2xl border border-ink-200 bg-[linear-gradient(168deg,#FFFFFF_0%,#F1F4F8_100%)] p-7 ${GLOSS} ${LIFT} hover:border-brand-300`}
            >
              {/* The model, right of the words and running to the card edge. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/home/discipline-${entry.id}.png`}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 bottom-0 h-[92%] w-auto transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [mask-image:radial-gradient(closest-side,#000_78%,transparent)] group-hover:scale-[1.04]"
              />

              <div className="relative mt-10 max-w-[12rem]">
                <h3 className="font-display text-card-title font-semibold text-ink-950 lg:text-card-title-lg">
                  {entry.label}
                </h3>
                <p className="mt-1.5 text-card-body text-ink-500">{entry.tagline}</p>
              </div>

              <span className="relative grid h-12 w-12 place-items-center rounded-full bg-white text-ink-800 shadow-[0_4px_14px_-4px_rgba(6,20,34,0.25)] transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
                <Icon name="arrow-right" className="text-base" />
                <span className="sr-only">Explore {entry.label} plugins</span>
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
