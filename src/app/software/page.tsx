import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import LogoTile from "@/components/common/LogoTile";
import { ContactBand } from "@/components/common/ContactActions";
import { crossPlatformFlows, softwarePlatforms } from "@/data/software";
import { additionalSoftware } from "@/data/software-menu";
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
                  <LogoTile
                    platform={platform}
                    size="lg"
                    className="transition-colors duration-200 group-hover:border-azure-300"
                  />
                  <div className="min-w-0">
                    <h2 className="font-display text-card-title font-semibold text-ink-950 group-hover:text-azure-700 lg:text-card-title-lg">
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

                <p className="mt-5 text-card-body text-ink-600">{platform.tagline}</p>

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

                <span className="mt-5 inline-flex items-center gap-1.5 text-card-meta font-medium text-azure-600">
                  View {platform.shortName} automation
                  <Icon
                    name="arrow-right"
                    className="text-sm transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>

          {/* The rest of the stack. These are applications we work in daily but
              have not written a capability page for — listed so the header menu
              always lands somewhere, and so the board on our profile and the
              site agree with each other. */}
          <div className="mt-14 border-t border-ink-200 pt-10">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950">
              Also in the stack
            </h2>
            <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
              We model, analyse, review and report in these too. Automation here is scoped per
              project rather than shipped as listed plugins — tell us what the task is and we
              will tell you what can be automated.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {additionalSoftware.map((item) => (
                <li
                  key={item.id}
                  id={`sw-${item.id}`}
                  className="flex scroll-mt-28 items-start gap-3.5 rounded-xl border border-ink-200 bg-white px-5 py-4 transition-colors target:border-azure-400"
                >
                  <LogoTile platform={item} size="md" />
                  <div className="min-w-0">
                    <p className="font-display text-card-title font-semibold text-ink-950 lg:text-card-title-lg">
                      {item.label}
                    </p>
                    <p className="mt-0.5 font-mono text-2xs text-ink-400">{item.vendor}</p>
                    <p className="mt-2 text-card-meta text-ink-600">{item.role}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-azure-600 hover:text-azure-700"
            >
              Ask what we can automate in yours
              <Icon name="arrow-right" className="text-sm" />
            </Link>
          </div>
        </Container>
      </section>

      {/* The point of the whole thing: the platforms are not eight islands. */}
      <section className="relative overflow-hidden border-y border-ink-200 bg-ink-950 py-16 text-white sm:py-20">
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
