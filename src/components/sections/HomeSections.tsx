import type { CSSProperties } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import SectionHeading from "@/components/ui/SectionHeading";
import BlueprintGrid from "@/components/common/BlueprintGrid";
import ProductMark from "@/components/common/ProductMark";
import ToolGrid from "@/components/marketplace/ToolGrid";
import { disciplineFamilies, disciplineMap } from "@/data/disciplines";
import { softwarePlatforms } from "@/data/software";
import { stages } from "@/data/stages";
import { capabilityCount } from "@/lib/software";
import { featuredTools, familyCount, toolsForDiscipline, toolsForStage } from "@/lib/tools";

/* ------------------------------------------------------------------ */
/* "What do you work with?" — the first decision                       */
/* ------------------------------------------------------------------ */

export function DisciplineChooser() {
  return (
    <section className="border-b border-ink-200 bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Start here"
          title="What do you work with?"
          lede="Pick your discipline. You should never have to know which host application a plugin loads into in order to find it."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {disciplineFamilies.map((family, index) => {
            const isMep = family.id === "mepf";
            // MEPF lists its seven services; every other family lists its stages.
            const children: { label: string; href: string }[] = isMep
              ? family.members.map((id) => ({
                  label: disciplineMap[id].shortName,
                  href: `/tools/${disciplineMap[id].slug}`,
                }))
              : disciplineMap[family.members[0]].groups.map((group) => ({
                  label: group.name,
                  href: `/tools/${family.slug}#${group.id}`,
                }));

            return (
              <div
                key={family.id}
                data-reveal="scale"
                style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white p-7 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                />
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-ink-200 bg-ink-50 text-brand-600 transition-colors group-hover:border-brand-200 group-hover:bg-brand-50">
                  <Icon name={family.glyph} className="text-2xl" />
                </span>

                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink-950">
                  {family.name}
                </h3>
                <p className="mt-1.5 font-mono text-2xs text-ink-400">
                  {familyCount(family.id)} tools
                </p>

                <ul className="mt-5 flex-1 space-y-1.5 border-t border-ink-100 pt-5">
                  {children.slice(0, 8).map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="flex items-center gap-1.5 text-[0.8125rem] text-ink-600 transition-colors hover:text-brand-600"
                      >
                        <span className="h-1 w-1 rounded-full bg-ink-300" />
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/tools/${family.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-900 transition-colors group-hover:text-brand-600 after:absolute after:inset-0 after:content-['']"
                >
                  View {family.shortName} tools
                  <Icon
                    name="arrow-right"
                    className="text-[0.85rem] text-brand-500 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* "What do you already run?" — the software axis                      */
/* ------------------------------------------------------------------ */

export function SoftwareChooser() {
  return (
    <section className="border-b border-ink-200 bg-ink-50/60 py-20 sm:py-24">
      <Container>
        <SectionHeading
          accent="azure"
          eyebrow="CAD, BIM & Engineering Automation Platform"
          title="One ecosystem, eight platforms"
          lede="Design → analysis → coordination → documentation → scheduling → reporting → project management, automated across the complete project lifecycle. Pick the application you already have open."
          action={
            <Button href="/software" variant="azure" icon="arrow-right">
              All software
            </Button>
          }
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {softwarePlatforms.map((platform, index) => (
            <Link
              key={platform.id}
              href={`/software/${platform.slug}`}
              data-reveal="scale"
              style={{ "--reveal-delay": `${index * 60}ms` } as CSSProperties}
              className="group flex items-center gap-4 rounded-xl border border-ink-200 bg-white p-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-azure-300 hover:shadow-lift active:scale-[0.98]"
            >
              <ProductMark
                platform={platform}
                size="lg"
                className="transition-transform duration-200 group-hover:scale-105"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[1.0625rem] font-semibold tracking-tight text-ink-950 group-hover:text-azure-700">
                  {platform.shortName}
                </span>
                <span className="block truncate text-[0.8125rem] text-ink-500">
                  {platform.role}
                </span>
              </span>
              <span className="shrink-0 font-mono text-2xs text-ink-400">
                {capabilityCount(platform)}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Lifecycle                                                           */
/* ------------------------------------------------------------------ */

export function StageJourney() {
  return (
    <section className="relative overflow-hidden border-b border-ink-800 bg-ink-950 py-20 text-white sm:py-24">
      <BlueprintGrid variant="dark" />
      <Container className="relative">
        <SectionHeading
          onDark
          eyebrow="Project lifecycle"
          title="Tools for every stage, in the order you need them"
          lede="BIMAC is built stage by stage, from the first site study through to as-built handover. Start where your bottleneck actually is."
          action={
            <Button href="/stages" variant="onDark" icon="arrow-right">
              All stages
            </Button>
          }
        />

        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage, index) => (
            <li
              key={stage.id}
              data-reveal=""
              style={{ "--reveal-delay": `${index * 55}ms` } as CSSProperties}
              className="bg-ink-950"
            >
              <Link
                href={`/stages/${stage.slug}`}
                className="group flex h-full flex-col p-6 transition-colors hover:bg-ink-900"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xs text-brand-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-white/10" />
                  <Icon name={stage.glyph} className="text-base text-brand-400" />
                </div>
                <h3 className="mt-4 font-display text-[1.0625rem] font-semibold tracking-tight text-white">
                  {stage.name}
                </h3>
                <p className="mt-1 font-mono text-2xs text-ink-500">{stage.lod}</p>
                <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-ink-400">
                  {stage.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-300 group-hover:text-brand-300">
                  {toolsForStage(stage.id).length} tools
                  <Icon
                    name="arrow-right"
                    className="text-[0.85rem] transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Featured tools                                                      */
/* ------------------------------------------------------------------ */

export function FeaturedTools() {
  return (
    <section className="border-b border-ink-200 bg-ink-50/60 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Featured"
          title="Where most teams start"
          lede="The tools that remove the largest blocks of repeated production work — across concept, conversion, layout, and documentation."
          action={
            <Button href="/tools" variant="secondary" icon="arrow-right">
              All tools
            </Button>
          }
        />
        <ToolGrid tools={featuredTools(6)} columns={3} className="mt-12" />
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* MEPF breakdown                                                      */
/* ------------------------------------------------------------------ */

export function MepBreakdown() {
  const mep = disciplineFamilies.find((family) => family.id === "mepf");
  if (!mep) return null;

  return (
    <section className="border-b border-ink-200 bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="MEPF"
          title="Seven services, kept separate"
          lede="A fire alarm engineer should not have to search through ductwork to find their own tools. Each service has its own catalogue and its own lifecycle."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
          {mep.members.map((id) => {
            const discipline = disciplineMap[id];
            return (
              <Link
                key={id}
                href={`/tools/${discipline.slug}`}
                className="group bg-white p-6 transition-colors hover:bg-brand-50/40"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-ink-200 bg-ink-50 text-brand-600 transition-colors group-hover:border-brand-200 group-hover:bg-white">
                    <Icon name={discipline.glyph} className="text-xl" />
                  </span>
                  <span className="font-mono text-2xs text-ink-400">
                    {toolsForDiscipline(id).length} tools
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[1.0625rem] font-semibold tracking-tight text-ink-950">
                  {discipline.shortName}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-600">
                  {discipline.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-900 group-hover:text-brand-600">
                  View tools
                  <Icon
                    name="arrow-right"
                    className="text-[0.85rem] text-brand-500 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Custom development                                                  */
/* ------------------------------------------------------------------ */

export function CustomDevelopmentBand() {
  return (
    <section className="border-b border-ink-200 bg-ink-50/60 py-20 sm:py-24">
      <Container>
        <div className="grid items-center gap-10 rounded-2xl border border-ink-200 bg-white p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <SectionHeading
              eyebrow="Custom development"
              title="Need something built for your workflow?"
              lede="If your process needs a tool the catalogue does not cover, BIMAC builds it — the same engineering, scoped to a problem specific to your team."
            />
            <div className="mt-8">
              <Button href="/custom-development" icon="arrow-right">
                How custom builds work
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-ink-200 bg-ink-50/70 p-6">
            <p className="mb-4 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Built on
            </p>
            <div className="grid grid-cols-2 gap-2">
              {["Revit API", "Dynamo", "AutoCAD .NET", "Navisworks", "Rhino", "IFC", "Excel", "C# / Python"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-center text-[0.8125rem] font-medium text-ink-700"
                  >
                    {tech}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
