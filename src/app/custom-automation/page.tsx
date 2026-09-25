import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import CustomToolGraph from "@/components/common/CustomToolGraph";
import ContactActions, { ContactBand } from "@/components/common/ContactActions";

export const metadata: Metadata = {
  title: "Custom Automation",
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

export default function CustomAutomationPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-12rem] top-[-12rem] h-[38rem] w-[38rem] rounded-full bg-brand-500/15 blur-[140px]"
        />
        <Container className="relative">
          <div className="py-6">
            <Breadcrumbs
              onDark
              items={[{ label: "Home", href: "/" }, { label: "Custom Automation" }]}
            />
          </div>
          {/* Two columns, centred against each other: the graph then sits in
              the middle of the dark band rather than hanging off the bottom of
              the copy. The headline stays in the left column so the picture can
              rise beside it. */}
          <div className="grid items-center gap-12 pb-16 lg:grid-cols-2 lg:gap-14 lg:pb-24">
            <div>
              <p className="mb-4 flex items-center gap-2.5 text-2xs font-semibold uppercase tracking-[0.16em] text-brand-400">
                <span className="h-px w-6 bg-brand-500" />
                Custom automation
              </p>
              <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tightest text-white sm:text-[3.25rem]">
                Turn Repetitive Work into{" "}
                <span className="text-brand-500">Automated Workflows</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-300">
                We build custom tools, plugins, and automation workflows for AEC teams — tailored
                to your software, process, and project needs. Save time, reduce errors, and focus
                on what matters: better design and delivery.
              </p>

              <ContactActions size="lg" variant="dark" className="mt-8" context="a custom build" />
              <p className="mt-4 font-mono text-2xs text-ink-500">
                Custom solutions · Faster workflows · Real project impact
              </p>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-brand-500/20 via-transparent to-transparent blur-2xl"
              />
              <CustomToolGraph className="relative" />
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
                <h3 className="mt-4 text-card-title font-semibold text-ink-950 lg:text-card-title-lg">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-card-body text-ink-600">{step.description}</p>
              </li>
            ))}
          </ol>
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
