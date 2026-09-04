import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import ToolHero from "@/components/tool/ToolHero";
import ToolDemo from "@/components/tool/ToolDemo";
import { ToolFeatures, ToolIO, ToolProcess } from "@/components/tool/ToolSections";
import { ToolCardCompact } from "@/components/marketplace/ToolCard";
import { ContactBand } from "@/components/common/ContactActions";
import { disciplineMap } from "@/data/disciplines";
import { getStage, softwareMap } from "@/data/stages";
import { getToolByPath, toolHref, tools } from "@/data/tools";
import { adjacentStageTools, relatedTools } from "@/lib/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({
    discipline: tool.disciplines[0],
    tool: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ discipline: string; tool: string }>;
}): Promise<Metadata> {
  const { discipline, tool: slug } = await params;
  const tool = getToolByPath(discipline, slug);
  if (!tool) return { title: "Tool not found" };
  return {
    title: tool.name,
    description: tool.summary,
    alternates: { canonical: toolHref(tool) },
    openGraph: { title: tool.name, description: tool.summary },
  };
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "demo", label: "Demo" },
  { id: "features", label: "Features" },
  { id: "inputs-outputs", label: "Inputs & Outputs" },
  { id: "how-it-works", label: "How it works" },
  { id: "related", label: "Related" },
];

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ discipline: string; tool: string }>;
}) {
  const { discipline: disciplineSlug, tool: toolSlug } = await params;
  const tool = getToolByPath(disciplineSlug, toolSlug);
  if (!tool) notFound();

  const primary = disciplineMap[tool.disciplines[0]];
  const stage = getStage(tool.stage);
  const related = relatedTools(tool, 4);
  const { previous, next } = adjacentStageTools(tool);

  return (
    <>
      <ToolHero tool={tool} />

      <nav
        aria-label="Sections"
        className="sticky top-[4.5rem] z-30 border-b border-ink-200 bg-white/90 backdrop-blur-md"
      >
        <Container>
          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="flex min-w-max items-center gap-1">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block whitespace-nowrap px-3 py-3.5 text-[0.8125rem] font-medium text-ink-600 transition-colors hover:text-brand-600"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </nav>

      {/* overview */}
      <section id="overview" className="scroll-mt-32 border-b border-ink-200 bg-white py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <SectionHeading eyebrow="Overview" title={`What ${tool.name} does`} />
              <div className="mt-6 space-y-5">
                {tool.what.map((paragraph, index) => (
                  <p key={index} className="text-[1.0625rem] leading-relaxed text-ink-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <aside className="lg:pt-2">
              <div className="rounded-xl border border-ink-200 bg-ink-50/60 p-6">
                <p className="mb-4 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  At a glance
                </p>
                <dl className="space-y-3.5 text-[0.875rem]">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="shrink-0 text-ink-500">Stage</dt>
                    <dd className="text-right font-medium text-ink-900">
                      {stage.name}
                      <span className="block font-mono text-2xs font-normal text-ink-400">
                        {stage.lod}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="shrink-0 text-ink-500">Software</dt>
                    <dd className="text-right font-medium text-ink-900">
                      {tool.software.map((id) => softwareMap[id].shortName).join(", ")}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 border-t border-ink-200 pt-5">
                  <p className="mb-3 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                    Serves these disciplines
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.disciplines.map((id) => (
                      <Link key={id} href={`/tools/${disciplineMap[id].slug}`}>
                        <Badge
                          tone="outline"
                          className="transition-colors hover:border-brand-300 hover:text-brand-700"
                        >
                          {disciplineMap[id].shortName}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                  {tool.disciplines.length > 2 ? (
                    <p className="mt-3 text-[0.75rem] leading-relaxed text-ink-500">
                      One tool, one page — rather than a near-identical listing per discipline.
                    </p>
                  ) : null}
                </div>
              </div>

              {/* lifecycle neighbours */}
              {previous || next ? (
                <div className="mt-4 rounded-xl border border-ink-200 bg-white p-6">
                  <p className="mb-4 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                    {primary.shortName} lifecycle
                  </p>
                  <div className="space-y-2">
                    {previous ? (
                      <Link
                        href={toolHref(previous)}
                        className="group flex items-center gap-2 text-[0.8125rem] text-ink-600 hover:text-brand-600"
                      >
                        <Icon name="chevron-right" className="rotate-180 text-[0.8rem] text-ink-400" />
                        <span className="truncate">Before: {previous.name}</span>
                      </Link>
                    ) : null}
                    {next ? (
                      <Link
                        href={toolHref(next)}
                        className="group flex items-center gap-2 text-[0.8125rem] text-ink-600 hover:text-brand-600"
                      >
                        <Icon name="chevron-right" className="text-[0.8rem] text-ink-400" />
                        <span className="truncate">Next: {next.name}</span>
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </Container>
      </section>

      {/* demo */}
      <section id="demo" className="scroll-mt-32 border-b border-ink-200 bg-ink-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Demonstration"
            title="See it run"
            lede="A walkthrough on a real model — what goes in, what the tool does, and what comes out."
          />
          <div className="mt-10">
            <ToolDemo tool={tool} />
          </div>
        </Container>
      </section>

      {/* features */}
      <section id="features" className="scroll-mt-32 border-b border-ink-200 bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Features"
            title="What it does"
            lede={`Every capability in ${tool.name}, and what each one is actually for.`}
          />
          <div className="mt-10">
            <ToolFeatures features={tool.features} />
          </div>
        </Container>
      </section>

      {/* inputs & outputs */}
      <section
        id="inputs-outputs"
        className="scroll-mt-32 border-b border-ink-200 bg-ink-50/60 py-16 sm:py-20"
      >
        <Container>
          <SectionHeading
            eyebrow="Inputs & outputs"
            title="What goes in, what comes out"
            lede="So you can tell before a demo whether it fits the way your team already works."
          />
          <div className="mt-10">
            <ToolIO inputs={tool.inputs} outputs={tool.outputs} />
          </div>
        </Container>
      </section>

      {/* how it works */}
      <section
        id="how-it-works"
        className="scroll-mt-32 border-b border-ink-200 bg-white py-16 sm:py-20"
      >
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="From input to output"
            lede="The path a typical job takes through the tool."
          />
          <div className="mt-12">
            <ToolProcess tool={tool} />
          </div>
        </Container>
      </section>

      {/* related */}
      {related.length > 0 ? (
        <section
          id="related"
          className="scroll-mt-32 border-b border-ink-200 bg-ink-50/60 py-16 sm:py-20"
        >
          <Container>
            <SectionHeading
              eyebrow="Related tools"
              title="Works well alongside"
              lede="Tools sharing a discipline, a stage, or a place in the same workflow."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ToolCardCompact key={item.id} tool={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <ContactBand
        title={`Interested in ${tool.name}?`}
        lede="Message on WhatsApp or send an email and we will arrange a live demonstration on a model like yours."
        context={tool.name}
      />
    </>
  );
}
