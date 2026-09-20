import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import LogoTile from "@/components/common/LogoTile";
import { ContactBand } from "@/components/common/ContactActions";
import FlipToolCard from "@/components/marketplace/FlipToolCard";
import { disciplines } from "@/data/disciplines";
import { findPlatformBySlug, softwarePlatforms } from "@/data/software";
import { toolsForDiscipline } from "@/lib/tools";
import { capabilityCount, groupsFor } from "@/lib/software";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return softwarePlatforms.map((platform) => ({ software: platform.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ software: string }>;
}): Promise<Metadata> {
  const { software: slug } = await params;
  const platform = findPlatformBySlug(slug);
  if (!platform) return { title: "Software" };
  return {
    title: `${platform.name} Automation`,
    description: platform.description,
    alternates: { canonical: `/software/${platform.slug}` },
  };
}

export default async function SoftwarePlatformPage({
  params,
}: {
  params: Promise<{ software: string }>;
}) {
  const { software: slug } = await params;
  const platform = findPlatformBySlug(slug);
  if (!platform) notFound();

  const groups = groupsFor(platform);

  // Every tool that loads into this application, grouped by the discipline it
  // serves and kept in each discipline's own line-up order.
  const byDiscipline = disciplines
    .map((discipline) => ({
      discipline,
      tools: toolsForDiscipline(discipline.id).filter(
        (tool) => tool.software[0] === platform.id,
      ),
    }))
    .filter((group) => group.tools.length > 0);
  const total = capabilityCount(platform);
  const shipping = groups
    .flatMap((group) => group.capabilities)
    .filter((capability) => Boolean(capability.href)).length;

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-200 bg-white">
        <Container className="relative">
          <div className="py-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Software", href: "/software" },
                { label: platform.shortName },
              ]}
            />
          </div>

          <div className="grid gap-10 pb-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
            <div>
              <div className="mb-5 flex items-center gap-4">
                <LogoTile platform={platform} size="lg" />
                <div>
                  <p className="font-mono text-2xs uppercase tracking-[0.16em] text-ink-400">
                    {platform.vendor} &middot; {platform.role}
                  </p>
                  <h1 className="font-display text-3xl font-semibold leading-tight tracking-tightest text-ink-950 sm:text-4xl">
                    {platform.name}
                  </h1>
                </div>
              </div>

              <p className="text-lg font-medium text-azure-700">{platform.tagline}</p>
              <p className="mt-3 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-600">
                {platform.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/tools" size="lg" icon="arrow-right">
                  Browse the catalogue
                </Button>
                <Button
                  href={whatsappLink(`${platform.name} automation`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  variant="azure"
                >
                  Ask about {platform.shortName}
                </Button>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-azure-100 bg-azure-50/50 p-6 lg:mt-2">
              {[
                { value: String(total), label: "automations" },
                { value: String(groups.length), label: "groups" },
                { value: String(shipping), label: "listed as tools" },
                { value: platform.role, label: "role" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xs uppercase tracking-wider text-ink-500">{stat.label}</dt>
                  <dd className="mt-1 font-display text-lg font-semibold tracking-tight text-ink-950">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Jump rail — these lists are long. */}
          <nav aria-label="Sections" className="flex flex-wrap gap-2 border-t border-ink-200 py-5">
            {groups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-1.5 text-[0.8125rem] text-ink-700 transition-all hover:border-azure-300 hover:bg-azure-50 hover:text-azure-700"
              >
                {group.name}
                <span className="font-mono text-2xs text-ink-400">
                  {group.capabilities.length}
                </span>
              </a>
            ))}
          </nav>
        </Container>
      </section>

      {/* What this application actually gets, as the cards themselves.
          Grouped by discipline and counted, because "what runs in Revit" is
          the question this page exists to answer.

          A platform BIMAC automates but does not yet sell an add-in for —
          Navisworks, Excel, and the four after them — has no groups, and an
          empty band of grey is worse than no band at all. The capabilities
          above and the enquiry below still make the page worth landing on. */}
      {byDiscipline.length > 0 ? (
      <section className="bg-ink-50/60 py-14 sm:py-16">
        <Container>
          {byDiscipline.map(({ discipline, tools: hosted }, index) => (
            <div
              key={discipline.id}
              id={discipline.slug}
              className={cn("scroll-mt-24", index > 0 && "mt-16")}
            >
              <div className="mb-8 flex items-end justify-between gap-6">
                <div className="flex items-center gap-3.5">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-ink-200 bg-white text-brand-600">
                    <Icon name={discipline.glyph} className="text-xl" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
                      {discipline.shortName}
                    </h2>
                    <p className="mt-0.5 font-mono text-2xs uppercase tracking-[0.14em] text-ink-500">
                      {hosted.length} {hosted.length === 1 ? "tool" : "tools"}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/tools/${discipline.slug}`}
                  className="hidden shrink-0 items-center gap-1.5 text-[0.8125rem] font-medium text-ink-700 transition-colors hover:text-brand-600 sm:inline-flex"
                >
                  All {discipline.shortName.toLowerCase()} tools
                  <Icon name="arrow-right" className="text-[0.8rem] text-brand-500" />
                </Link>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                {hosted.map((tool, position) => (
                  <FlipToolCard key={tool.id} tool={tool} index={position + 1} />
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>
      ) : null}

      {/* Sideways navigation — the other seven platforms. */}
      <section className="border-t border-ink-200 bg-white py-14">
        <Container>
          <p className="mb-5 flex items-center gap-2.5 text-2xs font-semibold uppercase tracking-[0.16em] text-ink-400">
            <span className="h-px w-4 bg-azure-500" />
            Other platforms
          </p>
          <div className="flex flex-wrap gap-2.5">
            {softwarePlatforms
              .filter((other) => other.id !== platform.id)
              .map((other) => (
                <Link
                  key={other.id}
                  href={`/software/${other.slug}`}
                  className="group inline-flex items-center gap-2.5 rounded-xl border border-ink-200 px-4 py-2.5 transition-all hover:-translate-y-0.5 hover:border-azure-300 hover:shadow-lift"
                >
                  <LogoTile platform={other} size="sm" />
                  <span className="text-[0.875rem] font-medium text-ink-800 group-hover:text-azure-700">
                    {other.shortName}
                  </span>
                  <span className="font-mono text-2xs text-ink-400">
                    {capabilityCount(other)}
                  </span>
                </Link>
              ))}
          </div>
        </Container>
      </section>

      <ContactBand
        title={`Need something specific in ${platform.shortName}?`}
        lede="Describe the task, roughly how often it runs, and how long it takes today. We will tell you whether it is already covered or worth building."
      />
    </>
  );
}
