import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import BlueprintGrid from "@/components/common/BlueprintGrid";
import { ContactBand } from "@/components/common/ContactActions";
import { stages } from "@/data/stages";
import { toolsForStage } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools by Project Stage",
  description:
    "BIMAC tools organised by project stage — site and feasibility, concept, schematic, detailed design, analysis, documentation, coordination, construction, and as-built handover.",
};

export default function StagesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-200 bg-white">
        <BlueprintGrid
          variant="light"
          fade={false}
          className="opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <Container className="relative">
          <div className="py-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Project Stages" }]} />
          </div>
          <div className="max-w-3xl pb-12">
            <p className="mb-4 flex items-center gap-2.5 text-2xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              <span className="h-px w-6 bg-brand-500" />
              Project lifecycle
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tightest text-ink-950 sm:text-5xl">
              Tools for every stage
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              BIMAC is built stage by stage, from the first concept study through to as-built
              handover. Start where your bottleneck actually is.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-ink-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Nine stages"
            title="Site study to handover"
            lede="One lifecycle shared by every discipline, so a tool's position is comparable across architecture, structure, and the seven MEPF services. Each stage page lists every tool that operates there."
          />

          <ol className="mt-12 space-y-4">
            {stages.map((stage, index) => {
              const count = toolsForStage(stage.id).length;
              return (
                <li
                  key={stage.id}
                  data-reveal=""
                  style={{ "--reveal-delay": `${index * 60}ms` } as CSSProperties}
                >
                  <Link
                    href={`/stages/${stage.slug}`}
                    className="group flex flex-col gap-5 rounded-2xl border border-ink-200 bg-white p-7 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift sm:flex-row sm:items-center sm:gap-8"
                  >
                    <div className="flex shrink-0 items-center gap-4">
                      <span className="font-mono text-2xs text-brand-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="grid h-12 w-12 place-items-center rounded-xl border border-ink-200 bg-ink-50 text-brand-600 transition-colors group-hover:border-brand-200 group-hover:bg-brand-50">
                        <Icon name={stage.glyph} className="text-2xl" />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950 group-hover:text-brand-600">
                          {stage.name}
                        </h2>
                        <span className="font-mono text-2xs text-ink-400">{stage.lod}</span>
                      </div>
                      <p className="mt-1.5 text-[0.9375rem] text-brand-600">{stage.tagline}</p>
                      <p className="mt-2 max-w-3xl text-[0.875rem] leading-relaxed text-ink-600">
                        {stage.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                      <span className="font-display text-2xl font-semibold tracking-tight text-ink-950">
                        {count}
                      </span>
                      <span className="text-2xs uppercase tracking-wider text-ink-400">
                        tools
                      </span>
                      <Icon
                        name="arrow-right"
                        className="text-lg text-brand-500 transition-transform duration-200 group-hover:translate-x-0.5 sm:mt-2"
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <ContactBand
        title="Not sure which stage is costing you most?"
        lede="Describe how a typical project runs and where the overtime happens. We will tell you which stage to fix first."
      />
    </>
  );
}
