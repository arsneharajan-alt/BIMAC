import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import BlueprintGrid from "@/components/common/BlueprintGrid";
import ProductMark from "@/components/common/ProductMark";
import { ContactBand } from "@/components/common/ContactActions";
import { findPlatformBySlug, softwarePlatforms } from "@/data/software";
import { capabilityCount, groupsFor, type SoftwareCapabilityView } from "@/lib/software";
import { statusLabels } from "@/lib/tools";
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

/**
 * One row in a capability group.
 *
 * A capability that already ships as a catalogue tool becomes a link with its
 * availability badge. The rest are listed plainly — they describe what the
 * platform covers, and the enquiry band at the foot of the page is the way in.
 */
function CapabilityRow({ capability }: { capability: SoftwareCapabilityView }) {
  const content = (
    <>
      <Icon
        name={capability.href ? "check-circle" : "check"}
        className={cn(
          "mt-0.5 shrink-0 text-[0.9rem]",
          capability.href ? "text-azure-500" : "text-ink-300",
        )}
      />
      <span
        className={cn(
          "flex-1 text-[0.875rem] leading-6",
          capability.href ? "text-ink-800 group-hover:text-azure-700" : "text-ink-700",
        )}
      >
        {capability.name}
      </span>
      {capability.status && capability.status !== "planned" ? (
        <Badge tone={capability.status === "available" ? "success" : "neutral"}>
          {statusLabels[capability.status]}
        </Badge>
      ) : null}
      {capability.href ? (
        <Icon
          name="arrow-right"
          className="mt-1 shrink-0 text-[0.75rem] text-azure-500 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
        />
      ) : null}
    </>
  );

  if (!capability.href) {
    return <li className="flex items-start gap-2.5 rounded-lg px-2.5 py-2">{content}</li>;
  }

  return (
    <li>
      <Link
        href={capability.href}
        className="group flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-azure-50/70"
      >
        {content}
      </Link>
    </li>
  );
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
  const total = capabilityCount(platform);
  const shipping = groups
    .flatMap((group) => group.capabilities)
    .filter((capability) => Boolean(capability.href)).length;

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
                <ProductMark platform={platform} size="xl" />
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

      <section className="bg-ink-50/60 py-14 sm:py-16">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            {groups.map((group) => (
              <section
                key={group.id}
                id={group.id}
                className="scroll-mt-24 rounded-2xl border border-ink-200 bg-white p-7"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950">
                    {group.href ? (
                      <Link href={group.href} className="hover:text-azure-700">
                        {group.name}
                      </Link>
                    ) : (
                      group.name
                    )}
                  </h2>
                  <span className="shrink-0 font-mono text-2xs text-ink-400">
                    {group.capabilities.length}
                  </span>
                </div>
                {group.description ? (
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-600">
                    {group.description}
                  </p>
                ) : null}

                <ul className="mt-5 space-y-px border-t border-ink-100 pt-4">
                  {group.capabilities.map((capability) => (
                    <CapabilityRow key={capability.name} capability={capability} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </section>

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
                  <ProductMark platform={other} size="sm" />
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
