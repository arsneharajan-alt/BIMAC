import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import ContactActions, { ContactBand } from "@/components/common/ContactActions";
import ProjectImpact from "@/components/sections/ProjectImpact";
import { disciplines } from "@/data/disciplines";
import { tools } from "@/data/tools";
import { impact, site } from "@/lib/site";
import type { GlyphId } from "@/types";

export const metadata: Metadata = {
  title: "About",
  description:
    "BIMAC builds BIM automation plugins for architecture, structure and MEPF, covering the full project lifecycle from site study to as-built handover.",
};

const WHAT_WE_DO: { title: string; body: string; glyph: GlyphId }[] = [
  {
    title: "Site study to handover",
    glyph: "workflow",
    body: "Tools that cover the whole life of a project — site constraints and massing at feasibility, concept and schematic design, the detailed model, analysis, documentation, coordination, construction issue, and structured as-built handover.",
  },
  {
    title: "Architecture, Structure and MEPF",
    glyph: "users",
    body: "Each discipline gets its own catalogue, and MEPF splits further into HVAC, Electrical, Plumbing, Fire Fighting, Fire Alarm, ELV/ICT and BMS — so you find your tools without searching through everyone else's.",
  },
  {
    title: "Rule-driven layout and modelling",
    glyph: "target",
    body: "Sprinkler coverage, lighting levels, small power spacing, duct and pipe routing, structural framing from grids — work that follows written rules, generated rather than placed by hand.",
  },
  {
    title: "Documentation at package scale",
    glyph: "file-text",
    body: "Annotation, views, sheets and schedules produced as a set from a drawing register, rather than assembled one sheet at a time during issue week.",
  },
  {
    title: "Custom builds",
    glyph: "code",
    body: "If the task is specific to your organisation, it gets built for you — on Revit, Dynamo, AutoCAD, Navisworks, Excel, or as a standalone AI-driven tool, whichever the job calls for.",
  },
  {
    title: "Review before it writes",
    glyph: "shield-check",
    body: "Every tool that changes a model shows the change set first. Automation you cannot inspect is automation you cannot trust on a live delivery model.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-10rem] top-[-12rem] h-[36rem] w-[36rem] rounded-full bg-brand-500/12 blur-[140px]"
        />
        <Container className="relative">
          <div className="py-6">
            <Breadcrumbs onDark items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          </div>
          <div className="grid gap-12 pb-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:pb-24">
            <div>
              <p className="mb-4 flex items-center gap-2.5 text-2xs font-semibold uppercase tracking-[0.16em] text-brand-400">
                <span className="h-px w-6 bg-brand-500" />
                About BIMAC
              </p>
              <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tightest text-white sm:text-[3.25rem]">
                BIM automation, built by someone who does the work
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-300">
                {site.legalName} builds plugins for architecture, structure and MEPF — released
                one at a time, in the order a real project needs them, from the first site study
                through to as-built handover.
              </p>
              <ContactActions size="lg" variant="dark" className="mt-9" />
            </div>

            <div className="lg:pt-14">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
                {[
                  { value: String(impact.projectsCompleted), label: "Projects delivered" },
                  { value: String(tools.length), label: "Tools in the catalogue" },
                  { value: String(disciplines.length), label: "Disciplines covered" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-ink-950 px-5 py-5">
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

      {/* delivery record */}
      <section className="border-b border-ink-200 bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Delivery record"
            title="Projects delivered with automation"
            lede="BIMAC tools are built out of live project work, not in isolation. Every one of them exists because a real deliverable needed it."
          />
          <ProjectImpact className="mt-12" />
        </Container>
      </section>

      <section className="border-b border-ink-200 bg-ink-50/60 py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[24rem_1fr] lg:gap-16">
            <div>
              <SectionHeading eyebrow="What we do" title="Plugins that remove repeated work" />
              <div className="mt-6 space-y-5 text-[1.0625rem] leading-relaxed text-ink-600">
                <p>
                  Most of a BIM production week goes on work that requires skill but no
                  judgement — massing options redrawn by hand, CAD re-modelled in Revit,
                  sprinkler heads placed to rules that are already written down, annotation
                  placed one tag at a time, sheets assembled one by one.
                </p>
                <p>
                  BIMAC builds tools that do exactly those jobs. Each one targets a specific task
                  in a specific discipline at a specific stage, rather than trying to be a
                  platform that does everything approximately.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {WHAT_WE_DO.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-xl border border-ink-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-ink-200 bg-ink-50 text-brand-600 transition-colors group-hover:border-brand-200 group-hover:bg-brand-50">
                    <Icon name={item.glyph} className="text-xl" />
                  </span>
                  <h3 className="mt-4 font-display text-[1.0625rem] font-semibold tracking-tight text-ink-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-ink-200 bg-white py-16 sm:py-20">
        <Container>
          <div className="rounded-2xl border border-ink-200 bg-ink-50/60 p-8 sm:p-12">
            <SectionHeading
              eyebrow="Where we are"
              title="Early, and saying so"
              lede="BIMAC is a new practice. The catalogue sets out what is being built and what is available today — each tool carries its own status rather than being presented as finished."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/tools?status=available" icon="arrow-right">
                See what is available now
              </Button>
              <Button href="/tools" variant="secondary">
                Browse the full catalogue
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <ContactBand
        title="Get in touch"
        lede="Questions about a tool, a demonstration, or a custom build — WhatsApp is usually fastest."
      />
    </>
  );
}
