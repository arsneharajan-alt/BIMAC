import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import BlueprintGrid from "@/components/common/BlueprintGrid";
import { ContactBand } from "@/components/common/ContactActions";
import ToolGrid from "@/components/marketplace/ToolGrid";
import Catalogue from "@/components/marketplace/Catalogue";
import {
  disciplineFamilies,
  disciplineMap,
  disciplines,
  findDisciplineBySlug,
  findFamilyBySlug,
} from "@/data/disciplines";
import { stages } from "@/data/stages";
import { toolsForDiscipline, toolsForFamily, toolsInGroup } from "@/lib/tools";
import type { Discipline, Tool } from "@/types";

/** Every discipline slug, plus the MEPF family hub. */
export function generateStaticParams() {
  return [
    ...disciplines.map((discipline) => ({ discipline: discipline.slug })),
    { discipline: "mepf" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ discipline: string }>;
}): Promise<Metadata> {
  const { discipline: slug } = await params;
  const discipline = findDisciplineBySlug(slug);
  if (discipline) {
    return {
      title: `${discipline.name} Tools`,
      description: discipline.tagline,
      alternates: { canonical: `/tools/${discipline.slug}` },
    };
  }
  const family = findFamilyBySlug(slug);
  if (family) {
    return {
      title: `${family.name} Tools`,
      description: family.tagline,
      alternates: { canonical: `/tools/${family.slug}` },
    };
  }
  return { title: "Tools" };
}

export default async function DisciplineHubPage({
  params,
}: {
  params: Promise<{ discipline: string }>;
}) {
  const { discipline: slug } = await params;

  const discipline = findDisciplineBySlug(slug);
  const family = discipline ? null : findFamilyBySlug(slug);

  // MEP is a family hub rather than a single discipline.
  if (!discipline && family && family.id === "mepf") {
    return <MepFamilyHub />;
  }

  // The other families map one-to-one onto a discipline; redirect-by-render.
  const resolved =
    discipline ?? (family ? disciplineMap[family.members[0]] : undefined);
  if (!resolved) notFound();

  return <DisciplineHub discipline={resolved} />;
}

/* ------------------------------------------------------------------ */
/* Single discipline                                                   */
/* ------------------------------------------------------------------ */

function DisciplineHub({ discipline }: { discipline: Discipline }) {
  const allTools = toolsForDiscipline(discipline.id);
  const isMepMember = discipline.family === "mepf";

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <BlueprintGrid variant="dark" fade={false} className="opacity-[0.5]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-brand-500/15 blur-[130px]"
        />
        <Container className="relative">
          <div className="py-6">
            <Breadcrumbs
              onDark
              items={[
                { label: "Home", href: "/" },
                { label: "Tools", href: "/tools" },
                ...(isMepMember ? [{ label: "MEPF", href: "/tools/mepf" }] : []),
                { label: discipline.shortName },
              ]}
            />
          </div>

          <div className="grid gap-10 pb-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 lg:pb-20">
            <div>
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-brand-400">
                <Icon name={discipline.glyph} className="text-2xl" />
              </span>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.06] tracking-tightest text-white sm:text-5xl">
                {discipline.name}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-brand-300">
                {discipline.tagline}
              </p>
              <p className="mt-3 font-mono text-2xs text-ink-500">For {discipline.audience}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#all-tools" size="lg" icon="arrow-right">
                  Browse {allTools.length} tools
                </Button>
              </div>
            </div>

            <div className="lg:pt-14">
              <p className="text-[0.9375rem] leading-relaxed text-ink-300">
                {discipline.description}
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
                {[
                  { value: String(allTools.length), label: "Tools" },
                  { value: String(discipline.groups.length), label: "Groups" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-ink-950 px-5 py-4">
                    <dt className="text-2xs uppercase tracking-[0.14em] text-ink-500">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 font-display text-xl font-semibold tracking-tight text-white">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* group navigation */}
      <section className="sticky top-[4.5rem] z-30 border-b border-ink-200 bg-white/90 backdrop-blur-md">
        <Container>
          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="flex min-w-max items-center gap-1">
              {discipline.groups.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="flex items-center gap-2 whitespace-nowrap px-3 py-3.5 text-[0.8125rem] font-medium text-ink-600 transition-colors hover:text-brand-600"
                  >
                    {group.name}
                    <span className="rounded bg-ink-100 px-1.5 py-px font-mono text-2xs text-ink-500">
                      {toolsInGroup(discipline.id, group.id).length}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* one section per group — the workflow order she described */}
      {discipline.groups.map((group, index) => {
        const groupTools = toolsInGroup(discipline.id, group.id);
        if (groupTools.length === 0) return null;
        return (
          <section
            key={group.id}
            id={group.id}
            className={`scroll-mt-32 border-b border-ink-200 py-16 sm:py-20 ${
              index % 2 === 0 ? "bg-white" : "bg-ink-50/60"
            }`}
          >
            <Container>
              <SectionHeading
                eyebrow={`${index + 1} of ${discipline.groups.length}`}
                title={group.name}
                lede={group.description}
              />
              <ToolGrid tools={groupTools} columns={3} className="mt-10" />
            </Container>
          </section>
        );
      })}

      {/* full filterable catalogue */}
      <section
        id="all-tools"
        className="scroll-mt-32 border-b border-ink-200 bg-white py-16 sm:py-20"
      >
        <Container>
          <SectionHeading
            eyebrow="All tools"
            title={`Every ${discipline.shortName} tool`}
            lede="Filter by project stage, software, and availability."
          />
          <div className="mt-10">
            <Catalogue tools={allTools} showTabs={false} columns={3} />
          </div>
        </Container>
      </section>

      {/* stage coverage */}
      <section className="border-b border-ink-200 bg-ink-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Lifecycle coverage"
            title={`${discipline.shortName}, stage by stage`}
            lede="Where the tools sit across the life of a project, and where the gaps still are."
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-3">
            {stages.map((stage) => {
              const count = allTools.filter((tool) => tool.stage === stage.id).length;
              return (
                <Link
                  key={stage.id}
                  href={`/stages/${stage.slug}`}
                  className="group bg-white p-5 transition-colors hover:bg-brand-50/40"
                >
                  <div className="flex items-center justify-between">
                    <Icon name={stage.glyph} className="text-lg text-brand-500" />
                    <span className="font-mono text-2xs text-ink-400">{count}</span>
                  </div>
                  <h3 className="mt-3 text-[0.9375rem] font-medium tracking-tight text-ink-950 group-hover:text-brand-600">
                    {stage.name}
                  </h3>
                  <p className="mt-1 font-mono text-2xs text-ink-400">{stage.lod}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {discipline.faqs && discipline.faqs.length > 0 ? (
        <section className="border-b border-ink-200 bg-white py-16 sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
              <SectionHeading
                eyebrow="FAQ"
                title={`${discipline.shortName} questions`}
                lede="Compatibility, standards, and how these fit your existing template."
              />
              <Accordion items={discipline.faqs} />
            </div>
          </Container>
        </section>
      ) : null}

      <ContactBand
        title={`Talk about ${discipline.shortName.toLowerCase()} automation`}
        lede="Message on WhatsApp or send an email describing your workflow, and we will tell you which of these tools fits — or whether it needs a custom build."
        context={`${discipline.name} tools`}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* MEP family hub                                                      */
/* ------------------------------------------------------------------ */

function MepFamilyHub() {
  const family = disciplineFamilies.find((item) => item.id === "mepf");
  if (!family) notFound();

  const allTools: Tool[] = toolsForFamily("mepf");

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <BlueprintGrid variant="dark" fade={false} className="opacity-[0.5]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-brand-500/15 blur-[130px]"
        />
        <Container className="relative">
          <div className="py-6">
            <Breadcrumbs
              onDark
              items={[
                { label: "Home", href: "/" },
                { label: "Tools", href: "/tools" },
                { label: "MEPF" },
              ]}
            />
          </div>
          <div className="max-w-3xl pb-16">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-brand-400">
              <Icon name={family.glyph} className="text-2xl" />
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.06] tracking-tightest text-white sm:text-5xl">
              MEPF Automation Tools
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-brand-300">
              HVAC, Electrical, Plumbing, Fire Fighting, Fire Alarm, ELV/ICT and BMS — each with
              its own catalogue, so you are not searching through six other services to find yours.
            </p>
            <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-300">
              MEPF modelling is dominated by layout and routing work that follows written rules —
              spacing, coverage, gradients, fill capacity, clearances, separation. That makes it the
              most automatable part of a project, and the place where manual modelling costs the most.
            </p>
          </div>
        </Container>
      </section>

      {/* the seven services */}
      <section className="border-b border-ink-200 bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Choose your service"
            title="Seven services, seven catalogues"
            lede="Each service runs the same lifecycle — concept and calculation, layout and modelling, documentation, coordination, construction, and as-built."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {family.members.map((id) => {
              const discipline = disciplineMap[id];
              const count = toolsForDiscipline(id).length;
              return (
                <Link
                  key={id}
                  href={`/tools/${discipline.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
                  />
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-ink-200 bg-ink-50 text-brand-600 transition-colors group-hover:border-brand-200 group-hover:bg-brand-50">
                    <Icon name={discipline.glyph} className="text-2xl" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink-950">
                    {discipline.shortName}
                  </h3>
                  <p className="mt-1.5 font-mono text-2xs text-ink-400">{count} tools</p>
                  <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-ink-600">
                    {discipline.tagline}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-900 group-hover:text-brand-600">
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

      <section className="border-b border-ink-200 bg-ink-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="All MEPF tools"
            title="Every service in one catalogue"
            lede="Filter by service, project stage, software, and availability."
          />
          <div className="mt-10">
            <Catalogue tools={allTools} showTabs={false} columns={3} />
          </div>
        </Container>
      </section>

      <ContactBand
        title="Talk about MEPF automation"
        lede="Tell us which service and which task, and we will point you at the right tool — or tell you honestly that it needs building."
        context="MEPF tools"
      />
    </>
  );
}
