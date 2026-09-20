import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Accordion from "@/components/ui/Accordion";
import { disciplineFamilies } from "@/data/disciplines";
import { emailLink, site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to BIMAC on WhatsApp or by email about BIM automation tools, demonstrations, or a custom build.",
};

const FAQS = [
  {
    question: "How quickly will I get a reply?",
    answer:
      "WhatsApp is usually answered within a few hours during working days. Email is answered within one working day.",
  },
  {
    question: "Can I see a tool working before committing to anything?",
    answer:
      "Yes — a live demonstration on a model like yours is the normal first step. There is nothing to buy on this site, so there is no pressure attached to asking.",
  },
  {
    question: "What should I include in a first message?",
    answer:
      "The discipline you work in, the task that is costing you time, and roughly how many hours it takes today. That is usually enough to say whether an existing tool covers it or whether it needs building.",
  },
  {
    question: "Do you work with teams outside the UAE?",
    answer:
      "Yes. Everything is delivered remotely — demonstrations, installation support, and training all run over a call.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-200 bg-white">
        <Container className="relative">
          <div className="py-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          </div>
          <div className="max-w-3xl pb-12">
            <p className="mb-4 flex items-center gap-2.5 text-2xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              <span className="h-px w-6 bg-brand-500" />
              Contact
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tightest text-ink-950 sm:text-5xl">
              Let&apos;s talk about your workflow
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              There is no checkout here. Message directly and we will tell you honestly whether
              an existing tool solves your problem, or whether it needs to be built.
            </p>
          </div>
        </Container>
      </section>

      {/* the two real channels */}
      <section className="border-b border-ink-200 bg-ink-50/60 py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-ink-200 bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#25D366] hover:shadow-lift sm:p-10"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#25D366] transition-transform duration-300 group-hover:scale-x-100"
              />
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#25D366]/10 text-[#128C4A]">
                <Icon name="whatsapp" className="text-3xl" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink-950">
                WhatsApp
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">
                Fastest route. Send a message describing the task and we will reply the same day
                during working hours.
              </p>
              <p className="mt-5 font-mono text-[0.9375rem] text-ink-900">{site.phoneDisplay}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-[#128C4A]">
                Open WhatsApp
                <Icon
                  name="arrow-up-right"
                  className="text-sm transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </a>

            <a
              href={emailLink()}
              className="group relative overflow-hidden rounded-2xl border border-ink-200 bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift sm:p-10"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-500 transition-transform duration-300 group-hover:scale-x-100"
              />
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon name="mail" className="text-3xl" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink-950">
                Email
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">
                Better for anything with detail — a scope, a sample file, or a list of the tasks
                you want automated.
              </p>
              <p className="mt-5 break-all font-mono text-[0.9375rem] text-ink-900">
                {site.email}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand-600">
                Compose email
                <Icon
                  name="arrow-up-right"
                  className="text-sm transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </a>
          </div>

          {/* quick discipline enquiry links */}
          <div className="mt-10 rounded-2xl border border-ink-200 bg-white p-7 sm:p-9">
            <p className="mb-5 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Enquire about a specific discipline
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {disciplineFamilies.map((family) => (
                <a
                  key={family.id}
                  href={whatsappLink(`${family.name} tools`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-ink-200 px-4 py-3 transition-all hover:border-[#25D366] hover:bg-[#25D366]/5"
                >
                  <Icon name={family.glyph} className="text-lg text-brand-500" />
                  <span className="flex-1 text-[0.875rem] font-medium text-ink-900">
                    {family.shortName}
                  </span>
                  <Icon
                    name="whatsapp"
                    className="text-base text-ink-300 transition-colors group-hover:text-[#128C4A]"
                  />
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
            <SectionHeading
              eyebrow="FAQ"
              title="Before you message"
              lede="Response times, demonstrations, and what to include."
            />
            <Accordion items={FAQS} />
          </div>
        </Container>
      </section>
    </>
  );
}
