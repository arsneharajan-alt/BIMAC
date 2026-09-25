import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { ContactBand } from "@/components/common/ContactActions";
import FlipToolCard from "@/components/marketplace/FlipToolCard";
import {
  disciplineMap,
  disciplines,
  findDisciplineBySlug,
  findFamilyBySlug,
} from "@/data/disciplines";
import ProductMark from "@/components/common/ProductMark";
import { softwarePlatformMap } from "@/data/software";
import { disciplineLineup } from "@/lib/tools";
import type { Discipline, SoftwarePlatform, Tool } from "@/types";

/** Every discipline slug. Each family maps onto exactly one of them. */
export function generateStaticParams() {
  return disciplines.map((discipline) => ({ discipline: discipline.slug }));
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

  // Every family maps one-to-one onto a discipline; redirect-by-render.
  const resolved =
    discipline ?? (family ? disciplineMap[family.members[0]] : undefined);
  if (!resolved) notFound();

  return <DisciplineHub discipline={resolved} />;
}

/* ------------------------------------------------------------------ */
/* Single discipline                                                   */
/* ------------------------------------------------------------------ */

/**
 * The line-up split by the application each tool loads into.
 *
 * Order is preserved: a host appears where its first tool does, and its tools
 * stay in line-up order inside it. So a catalogue that is all Revit comes out
 * as one group in exactly the order it was written.
 */
function byHost(tools: Tool[]): { platform?: SoftwarePlatform; tools: Tool[] }[] {
  const groups: { platform?: SoftwarePlatform; tools: Tool[] }[] = [];
  for (const tool of tools) {
    const platform = softwarePlatformMap[tool.software[0]];
    const last = groups.find((group) => group.platform?.id === platform?.id);
    if (last) last.tools.push(tool);
    else groups.push({ platform, tools: [tool] });
  }
  return groups;
}

function DisciplineHub({ discipline }: { discipline: Discipline }) {
  const lineup = disciplineLineup(discipline.id);
  // Numbered off the whole line-up, not off the group, so card 12 is the
  // twelfth product whichever host heading it happens to sit under.
  const numbers = new Map(lineup.map((tool, index) => [tool.id, index + 1]));

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
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
                  Browse {lineup.length} tools
                </Button>
              </div>
            </div>

            <div className="lg:pt-14">
              <p className="text-[0.9375rem] leading-relaxed text-ink-300">
                {discipline.description}
              </p>
              {/* One figure, not a table of them: how many tools there are. */}
              <dl className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-navy px-5 py-4">
                <dt className="text-2xs uppercase tracking-[0.14em] text-ink-500">Tools</dt>
                <dd className="mt-1 font-display text-xl font-semibold tracking-tight text-white">
                  {lineup.length}
                </dd>
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* The line-up itself — one even grid, numbered from the first card. */}
      <section
        id="all-tools"
        className="scroll-mt-24 border-b border-ink-200 bg-white py-16 sm:py-20"
      >
        <Container>
          {/* Grouped by the application the tools load into. Nearly all of them
              are Revit add-ins, so this reads as one heading and a count rather
              than as a list of sections — which is the point: it says what you
              need installed before it says anything else. */}
          {byHost(lineup).map(({ platform, tools: hosted }, groupIndex) => (
            <div key={platform?.id ?? "none"} className={groupIndex > 0 ? "mt-16" : undefined}>
              {platform ? (
                <div className="mb-8 flex items-center gap-3.5">
                  <ProductMark platform={platform} size="lg" />
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
                      {platform.shortName}
                    </h2>
                    <p className="mt-0.5 font-mono text-2xs uppercase tracking-[0.14em] text-ink-500">
                      {hosted.length} {hosted.length === 1 ? "tool" : "tools"}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Two to a row, and only once there is room for two: every card
                  is the proportion the designed cards are drawn at, so a narrow
                  window would leave each one too short to read. */}
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {hosted.map((tool) => (
                  <FlipToolCard key={tool.id} tool={tool} index={numbers.get(tool.id)} />
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>

      {discipline.faqs && discipline.faqs.length > 0 ? (
        <section className="border-b border-ink-200 bg-ink-50/60 py-16 sm:py-20">
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
