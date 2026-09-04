import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import BlueprintGrid from "@/components/common/BlueprintGrid";
import ProductMark from "@/components/common/ProductMark";
import { ContactBand } from "@/components/common/ContactActions";
import { crossPlatformFlows, softwarePlatforms } from "@/data/software";
import { capabilityCount, groupNames, totalCapabilities } from "@/lib/software";

export const metadata: Metadata = {
  title: "Automation by Software",
  description:
    "What BIMAC automates in Revit, AutoCAD, Navisworks, Excel, Power BI, Primavera P6, ETABS and MS Project — one connected ecosystem from design through analysis, coordination, documentation, scheduling and reporting.",
};

export default function SoftwarePage() {
  const total = totalCapabilities();

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
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Software" }]} />
          </div>
          <div className="max-w-3xl pb-12">
            <p className="mb-4 flex items-center gap-2.5 text-2xs font-semibold uppercase tracking-[0.16em] text-azure-600">
              <span className="h-px w-6 bg-azure-500" />
              CAD, BIM &amp; Engineering Automation Platform
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tightest text-ink-950 sm:text-5xl">
              Automation by software
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              {total} automations across {softwarePlatforms.length} platforms. Pick the
              application you already have open — the page lists exactly what we automate inside
              it, grouped the way that software is actually used on a project.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-ink-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            accent="azure"
            eyebrow="Eight platforms"
            title="Design, analysis, coordination, scheduling, reporting"
            lede="Discipline is still the best way into the catalogue. This is the other way in — by the software the work happens in."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {softwarePlatforms.map((platform, index) => (
              <Link
                key={platform.id}
                href={`/software/${platform.slug}`}
                data-reveal="scale"
                style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white p-7 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-azure-300 hover:shadow-lift active:scale-[0.99]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-azure-500 transition-transform duration-300 group-hover:scale-x-100"
                />
                <div className="flex items-start gap-4">
                  <ProductMark
                    platform={platform}
                    size="xl"
                    className="transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950 group-hover:text-azure-700">
                      {platform.shortName}
                    </h2>
                    <p className="mt-0.5 font-mono text-2xs text-ink-400">{platform.vendor}</p>
                  </div>
                  <span className="ml-auto shrink-0 text-right">
                    <span className="block font-display text-lg font-semibold tracking-tight text-ink-950">
                      {capabilityCount(platform)}
                    </span>
                    <span className="block text-2xs uppercase tracking-wider text-ink-400">
                      tools
                    </span>
                  </span>
                </div>

                <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-600">
                  {platform.tagline}
                </p>

                <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-ink-100 pt-5">
                  {groupNames(platform).map((name) => (
                    <li
                      key={name}
                      className="rounded-md bg-ink-100 px-2 py-0.5 text-2xs font-medium text-ink-700 ring-1 ring-inset ring-ink-200/70"
                    >
                      {name}
                    </li>
                  ))}
                </ul>

                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-azure-600">
                  View {platform.shortName} automation
                  <Icon
                    name="arrow-right"
                    className="text-sm transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* The point of the whole thing: the platforms are not eight islands. */}
      <section className="relative overflow-hidden border-y border-ink-200 bg-ink-950 py-16 text-white sm:py-20">
        <BlueprintGrid variant="dark" fade={false} className="opacity-40" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-10rem] top-[-8rem] h-[32rem] w-[32rem] rounded-full bg-azure-500/14 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-12rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-brand-500/12 blur-[130px]"
        />
        <Container className="relative">
          <SectionHeading
            onDark
            accent="azure"
            eyebrow="Cross-platform automation"
            title="One connected ecosystem"
            lede="Design → analysis → coordination → documentation → scheduling → reporting → project management, automated across the complete project lifecycle instead of stopping at each application boundary."
          />

          <ul className="mt-12 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {crossPlatformFlows.map((flow, index) => (
              <li
                key={flow.label}
                data-reveal=""
                style={{ "--reveal-delay": `${Math.min(index, 8) * 50}ms` } as CSSProperties}
                className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-azure-400/40 hover:bg-azure-500/[0.08]"
              >
                <Icon name="workflow" className="shrink-0 text-base text-azure-400" />
                <span className="text-[0.875rem] text-ink-200">{flow.label}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ContactBand
        title="Running something that isn't on this list?"
        lede="Tell us which application eats your week and what the repetitive task actually is. If it has an API, it can usually be automated."
      />
    </>
  );
}
