import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductGlyph from "@/components/common/ProductGlyph";
import ContactActions from "@/components/common/ContactActions";
import { disciplineMap, getFamily } from "@/data/disciplines";
import { softwareMap } from "@/data/stages";
import { statusLabels } from "@/lib/tools";
import { cn } from "@/lib/utils";
import type { Tool, ToolStatus } from "@/types";

const statusDot: Record<ToolStatus, string> = {
  available: "bg-emerald-500",
  "in-development": "bg-amber-500",
  planned: "bg-ink-400",
};

export function ToolHero({ tool }: { tool: Tool }) {
  const primary = disciplineMap[tool.disciplines[0]];
  const family = getFamily(primary.family);
  const group = primary.groups.find((item) => item.id === tool.group);

  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-brand-500/15 blur-[120px]"
      />

      <Container className="relative">
        <div className="py-6">
          <Breadcrumbs
            onDark
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools" },
              { label: family.shortName, href: `/tools/${family.slug}` },
              ...(family.id === "mep"
                ? [{ label: primary.shortName, href: `/tools/${primary.slug}` }]
                : []),
              { label: tool.name },
            ]}
          />
        </div>

        <div className="max-w-3xl pb-16 lg:pb-20">
          <div className="flex items-start gap-4">
            <ProductGlyph glyph={tool.glyph} size="xl" onDark />
            <div className="min-w-0 pt-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {tool.disciplines.map((id) => (
                  <Link key={id} href={`/tools/${disciplineMap[id].slug}`}>
                    <Badge
                      tone="muted"
                      className="transition-colors hover:bg-brand-500/20 hover:text-brand-200"
                    >
                      {disciplineMap[id].shortName}
                    </Badge>
                  </Link>
                ))}
              </div>
              <h1 className="text-balance font-display text-3xl font-semibold leading-tight tracking-tightest text-white sm:text-[2.75rem] sm:leading-[1.08]">
                {tool.name}
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-300">
            {tool.description}
          </p>

          <ContactActions context={tool.name} size="lg" variant="dark" className="mt-8" />
          <p className="mt-4 font-mono text-2xs text-ink-500">
            No checkout — talk to us directly about licensing, a demo, or a trial.
          </p>

          {/* spec strip */}
          <dl className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {[
              { label: "Discipline", value: primary.shortName },
              { label: "Group", value: group?.name ?? "—" },
              { label: "Software", value: tool.software.map((id) => softwareMap[id].shortName).join(", ") },
            ].map((spec) => (
              <div key={spec.label} className="bg-ink-950 px-4 py-3.5">
                <dt className="text-2xs uppercase tracking-[0.14em] text-ink-500">
                  {spec.label}
                </dt>
                <dd className="mt-1 truncate text-[0.8125rem] text-ink-200">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-2 text-[0.8125rem] text-ink-400">
              <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[tool.status])} />
              {statusLabels[tool.status]}
            </span>
            <span className="text-ink-700">·</span>
            <span className="flex flex-wrap items-center gap-3">
              {tool.software.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-400"
                >
                  <Icon name={softwareMap[id].glyph} className="text-[0.9em] text-ink-500" />
                  {softwareMap[id].shortName}
                </span>
              ))}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ToolHero;
