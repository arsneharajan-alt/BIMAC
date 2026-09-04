import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import BlueprintGrid from "@/components/common/BlueprintGrid";
import AppMockup from "@/components/common/AppMockup";
import ContactActions, { ContactBand } from "@/components/common/ContactActions";

export const metadata: Metadata = {
  title: "Custom Development",
  description:
    "BIMAC builds custom BIM automation tools tailored to your organisation's workflow — on whichever platform the job calls for.",
};

const PROCESS = [
  {
    title: "Describe the task",
    description:
      "Tell us what the job is, how often it happens, and roughly how many hours it takes today. That is enough to know whether it is worth automating.",
  },
  {
    title: "Scope and quote",
    description:
      "A written scope with acceptance criteria, a fixed price, and an explicit list of what is out of scope. No open-ended time and materials.",
  },
  {
    title: "Build and review",
    description:
      "Working builds you can run on a real project as we go, so course corrections happen early rather than at handover.",
  },
  {
    title: "Deliver and support",
    description:
      "Installer, documentation, a walkthrough for your team, and a maintained build for new host releases.",
  },
];

const FAQS = [
  {
    question: "Who owns the tool once it is built?",
    answer:
      "You do. For bespoke development the deliverable and its source are assigned to your organisation on final payment. Where a build reuses BIMAC's existing libraries, those components are licensed to you perpetually for the delivered application.",
  },
  {
    question: "How is custom work priced?",
    answer:
      "Fixed price against a written scope, so there is no exposure to overrun. Larger builds are split into phases, each priced separately once the previous one is accepted.",
  },
  {
    question: "Can you start from scripts we already have?",
    answer:
      "Yes, and it is usually the best starting point. A common first job is taking a set of fragile personal Dynamo graphs or macros and turning them into a tested, documented, deployable tool that survives staff changes.",
  },
  {
    question: "What happens when a new Revit version is released?",
    answer:
      "Bespoke tools can be covered by an annual maintenance agreement that includes a compatible build for each major host release. Without maintenance, upgrades are quoted individually.",
  },
  {
    question: "Will you sign an NDA?",
    answer:
      "Yes, as standard. We can also work within your infrastructure and source control, and subject to your security review process where that is required.",
  },
];

export default function CustomDevelopmentPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <BlueprintGrid variant="dark" fade={false} className="opacity-[0.5]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-12rem] top-[-12rem] h-[38rem] w-[38rem] rounded-full bg-brand-500/15 blur-[140px]"
        />
        <Container className="relative">
          <div className="py-6">
            <Breadcrumbs
              onDark
              items={[{ label: "Home", href: "/" }, { label: "Custom Development" }]}
            />
          </div>
          <div className="grid items-center gap-12 pb-16 lg:grid-cols-2 lg:gap-16 lg:pb-24">
            <div>
              <p className="mb-4 flex items-center gap-2.5 text-2xs font-semibold uppercase tracking-[0.16em] text-brand-400">
                <span className="h-px w-6 bg-brand-500" />
                Custom development
              </p>
              <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tightest text-white sm:text-[3.25rem]">
                Need a tool built for your workflow?
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-300">
                If the catalogue does not cover the task that eats your week, we build it — on
                whichever platform the job actually calls for. Revit, Dynamo, AutoCAD,
                Navisworks, Excel, or an AI-driven tool that runs on its own.
              </p>
              <ContactActions size="lg" variant="dark" className="mt-9" context="a custom build" />
              <p className="mt-4 font-mono text-2xs text-ink-500">
                Fixed price against a written scope · IP assigned to you
              </p>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-brand-500/20 via-transparent to-transparent blur-2xl"
              />
              <AppMockup
                layout="wizard"
                title="Bespoke tool — configuration"
                glyph="code"
                className="relative"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-ink-200 bg-ink-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="How a build runs"
            lede="Four steps, each producing something you can actually run at the end of it."
          />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, index) => (
              <li key={step.title}>
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink-950 font-mono text-[0.8125rem] font-semibold text-white">
                    {index + 1}
                  </span>
                  {index < PROCESS.length - 1 ? (
                    <span className="hidden h-px flex-1 bg-gradient-to-r from-ink-200 to-transparent sm:block" />
                  ) : null}
                </div>
                <h3 className="mt-4 text-[0.9375rem] font-semibold tracking-tight text-ink-950">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-600">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-ink-200 bg-white py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
            <SectionHeading
              eyebrow="FAQ"
              title="Before you ask"
              lede="Ownership, pricing, maintenance, and confidentiality."
            />
            <Accordion items={FAQS} />
          </div>
        </Container>
      </section>

      <ContactBand
        title="Tell us what is costing you time"
        lede="Send a description of the workflow and roughly how many hours it consumes. We will come back with an approach, an indicative range, and an honest view on whether an existing tool already solves it."
        context="a custom build"
      />
    </>
  );
}
