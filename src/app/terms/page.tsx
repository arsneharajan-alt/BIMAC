import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use, software licence terms, and security commitments for BIMAC.",
};

const SECTIONS = [
  {
    id: "using-this-site",
    title: "Using this site",
    body: [
      "This website is provided for information about BIMAC products and services. Product descriptions, pricing indications, and compatibility statements are provided in good faith and may change; the licence agreement accompanying a product governs what you actually receive.",
      "You may not attempt to gain unauthorised access to any part of this site, interfere with its operation, or use automated means to extract content at a scale that degrades service for others.",
    ],
  },
  {
    id: "licence",
    title: "Software licence terms",
    body: [
      "BIMAC software is licensed, not sold. A licence grants a named user the right to install and use the product on machines under their control, for the duration of the licence term, subject to the full licence agreement supplied with the product.",
      "Enterprise licences are granted to the organisation rather than to individual users, and cover use by employees and contractors working on that organisation's projects.",
      "You may not reverse engineer, decompile, redistribute, sublicense, or circumvent the licensing mechanism of any BIMAC product, except to the extent that such restriction is prohibited by applicable law.",
      "Free products are licensed for commercial use at no charge, with no user limit and no time restriction. They remain subject to the same restrictions on reverse engineering and redistribution.",
      "Trial licences grant full functionality for 30 days for evaluation purposes. Output produced during a trial may be used commercially.",
    ],
  },
  {
    id: "updates",
    title: "Updates and compatibility",
    body: [
      "An active licence includes updates, including compatibility builds for new major releases of the host application. These are normally published within four weeks of general availability of the host release.",
      "Where a host application vendor removes or changes an API that a product depends on, we will document the impact and provide a remedy or a pro-rata refund for the affected term if the capability cannot be restored.",
    ],
  },
  {
    id: "warranty",
    title: "Warranty and liability",
    body: [
      "BIMAC products are professional tools intended to be used by competent practitioners. Output must be reviewed by a qualified person before it is relied upon for design, construction, or commercial decisions.",
      "We warrant that products will perform substantially in accordance with their documentation. Where they do not, and we cannot remedy the defect, your remedy is a refund of the fees paid for the affected term.",
      "To the fullest extent permitted by law, BIMAC is not liable for indirect or consequential loss, loss of profit, or loss of data. Nothing in these terms excludes liability for death or personal injury caused by negligence, or for fraud.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: [
      "All rights in BIMAC products, this website, and its content remain with BIMAC or its licensors.",
      "You retain all rights in your own project data. Nothing in these terms grants BIMAC any right in your models, drawings, or project information.",
      "For bespoke development, intellectual property in the deliverable is assigned to the client on final payment, as set out in the applicable development agreement.",
    ],
  },
  {
    id: "security",
    title: "Security",
    body: [
      "BIMAC desktop products process project data locally. Licence validation transmits only a licence identifier and machine identifier, and carries no model or project content.",
      "Cloud products hold customer data in isolated tenancies with encryption in transit and at rest. Access to production systems requires multi-factor authentication and is logged.",
      "We operate a responsible disclosure process. Security issues can be reported to security@bimac.example; we acknowledge reports within two working days and do not pursue legal action against good-faith researchers.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing law",
    body: [
      "These terms are governed by the laws of England and Wales, and the courts of England and Wales have exclusive jurisdiction, save that we may seek injunctive relief in any competent jurisdiction.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-white">
        <Container>
          <div className="py-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]} />
          </div>
          <div className="max-w-3xl pb-12">
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tightest text-ink-950">
              Terms of Use
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              The terms on which {site.legalName} provides this website and licenses its software.
            </p>
            <p className="mt-4 font-mono text-2xs text-ink-400">Last updated 1 August 2026</p>
          </div>
        </Container>
      </section>

      <section className="bg-ink-50/60 py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
            <nav aria-label="Sections" className="lg:sticky lg:top-[6rem] lg:self-start">
              <p className="mb-3 text-2xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                On this page
              </p>
              <ul className="space-y-1">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded-md px-2 py-1.5 text-[0.8125rem] text-ink-600 transition-colors hover:bg-white hover:text-brand-600"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="max-w-3xl space-y-10">
              {SECTIONS.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph, index) => (
                      <p key={index} className="text-[0.9375rem] leading-relaxed text-ink-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
