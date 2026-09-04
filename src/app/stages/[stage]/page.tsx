import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import BlueprintGrid from "@/components/common/BlueprintGrid";
import { ContactBand } from "@/components/common/ContactActions";
import Catalogue from "@/components/marketplace/Catalogue";
import ToolGrid from "@/components/marketplace/ToolGrid";
import { disciplineFamilies } from "@/data/disciplines";
import { findStageBySlug, stages } from "@/data/stages";
import { toolsForStage } from "@/lib/tools";

export function generateStaticParams() {
  return stages.map((stage) => ({ stage: stage.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stage: string }>;
}): Promise<Metadata> {
  const { stage: slug } = await params;
  const stage = findStageBySlug(slug);
  if (!stage) return { title: "Project stage" };
  return {
    title: `${stage.name} Tools`,
    description: stage.tagline,
    alternates: { canonical: `/stages/${stage.slug}` },
  };
}

export default async function StagePage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage: slug } = await params;
  const stage = findStageBySlug(slug);
  if (!stage) notFound();

  const stageTools = toolsForStage(stage.id);
  const index = stages.findIndex((item) => item.id === stage.id);
  const previous = index > 0 ? stages[index - 1] : undefined;
  const next = index < stages.length - 1 ? stages[index + 1] : undefined;
  const featured = stageTools.filter((tool) => tool.featured).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <BlueprintGrid variant="dark" fade={false} className="opacity-[0.5]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-brand-500/15 blur-[130px]"
        />
        <Container className="relative">
          <div className="py-6">
            <Breadcrumbs
              onDark
              items={[
                { label: "Home", href: "/" },
                { label: "Project Stages", href: "/stages" },
                { label: stage.name },
              ]}
            />
          </div>
          <div className="grid gap-10 pb-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 lg:pb-20">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-brand-400">
                  <Icon name={stage.glyph} className="text-2xl" />
                </span>
                <span className="font-mono text-2xs uppercase tracking-[0.16em] text-ink-500">
                  Stage {index + 1} of {stages.length} · {stage.lod}
                </span>
              </div>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.06] tracking-tightest text-white sm:text-5xl">
                {stage.name}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-brand-300">
                {stage.tagline}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#all-tools" size="lg" icon="arrow-right">
                  See {stageTools.length} tools
                </Button>
              </div>
            </div>
            <div className="lg:pt-16">
              <p className="text-[0.9375rem] leading-relaxed text-ink-300">{stage.description}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* by discipline */}
      <section className="border-b border-ink-200 bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="By discipline"
            title={`Who works at ${stage.name.toLowerCase()}`}
            lede="How this stage is covered across architecture, structure, the seven MEPF services, and shared BIM automation."
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
            {disciplineFamilies.map((family) => {
              const count = stageTools.filter((tool) =>
                tool.disciplines.some((id) => family.members.includes(id)),
              ).length;
              return (
                <Link
                  key={family.id}
                  href={`/tools/${family.slug}`}
                  className="group bg-white p-6 transition-colors hover:bg-brand-50/40"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-ink-200 bg-ink-50 text-brand-600">
                      <Icon name={family.glyph} className="text-xl" />
                    </span>
                    <span className="font-mono text-2xs text-ink-400">{count}</span>
                  </div>
                  <h3 className="mt-4 font-display text-[1.0625rem] font-semibold tracking-tight text-ink-950 group-hover:text-brand-600">
                    {family.shortName}
                  </h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-600">
                    {count === 0
                      ? "No tools at this stage yet."
                      : `${count} ${count === 1 ? "tool" : "tools"} at this stage.`}
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {featured.length > 0 ? (
        <section className="border-b border-ink-200 bg-ink-50/60 py-16 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Featured"
              title={`Start here for ${stage.name.toLowerCase()}`}
            />
            <ToolGrid tools={featured} columns={3} className="mt-10" />
          </Container>
        </section>
      ) : null}

      <section id="all-tools" className="scroll-mt-24 border-b border-ink-200 bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="All tools"
            title={`Every tool at ${stage.name.toLowerCase()}`}
            lede="Filter by discipline, software, and availability."
          />
          <div className="mt-10">
            <Catalogue tools={stageTools} showTabs={false} columns={3} />
          </div>
        </Container>
      </section>

      {/* lifecycle navigation */}
      <section className="border-b border-ink-200 bg-ink-50/60 py-12">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/stages/${previous.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-ink-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-card"
              >
                <Icon name="chevron-right" className="rotate-180 text-lg text-ink-300 group-hover:text-brand-500" />
                <div>
                  <p className="text-2xs uppercase tracking-wider text-ink-400">Previous stage</p>
                  <p className="mt-0.5 text-[0.9375rem] font-medium text-ink-950 group-hover:text-brand-600">
                    {previous.name}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/stages/${next.slug}`}
                className="group flex items-center justify-end gap-4 rounded-xl border border-ink-200 bg-white p-5 text-right transition-all hover:border-brand-300 hover:shadow-card"
              >
                <div>
                  <p className="text-2xs uppercase tracking-wider text-ink-400">Next stage</p>
                  <p className="mt-0.5 text-[0.9375rem] font-medium text-ink-950 group-hover:text-brand-600">
                    {next.name}
                  </p>
                </div>
                <Icon name="chevron-right" className="text-lg text-ink-300 group-hover:text-brand-500" />
              </Link>
            ) : null}
          </div>
        </Container>
      </section>

      <ContactBand
        title={`Talk about ${stage.name.toLowerCase()}`}
        lede="Tell us what this stage costs you today and we will show you what changes."
        context={`${stage.name} tools`}
      />
    </>
  );
}
