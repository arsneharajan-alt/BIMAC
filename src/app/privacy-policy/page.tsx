import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How BIMAC collects, uses, and protects personal data.",
};

const SECTIONS = [
  {
    id: "what-we-collect",
    title: "What we collect",
    body: [
      "Account details you provide when registering: name, work email, organisation, and country. Where you purchase a licence, we also hold billing details processed by our payment provider.",
      "Licence validation data: the product, version, and licence identifier being validated, plus a machine identifier used to enforce named-user licensing. This exchange contains no model, project, or drawing content of any kind.",
      "Support correspondence, including any files you choose to attach to a ticket.",
      "Standard web analytics on this site: pages viewed, referrer, and approximate region derived from IP address.",
    ],
  },
  {
    id: "what-we-do-not-collect",
    title: "What we do not collect",
    body: [
      "BIMAC products process your models locally on your own workstation. We do not upload, copy, index, or transmit model geometry, parameter values, drawings, or project data as part of normal product operation.",
      "Where a product is explicitly cloud-based — such as ParamHub or the AI Assistant — the data you deliberately place in it is described in that product's own documentation, held in an isolated tenancy, and never used to train shared models.",
    ],
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: [
      "To provide and support the products you have licensed, including delivering updates and compatibility builds.",
      "To validate licences and prevent unauthorised use.",
      "To answer enquiries and provide technical support.",
      "To send product release notes where you have opted in. We do not run marketing sequences, and every message carries a single-click unsubscribe.",
    ],
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: [
      "Our payment processor, for transactions you initiate.",
      "Our infrastructure providers, who host the account portal and support system under contractual data-protection terms.",
      "Legal authorities, where we are compelled to do so by valid legal process.",
      "We do not sell personal data, and we do not share it with advertisers or data brokers.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: [
      "Account and licence records are retained for the life of the account and for seven years afterwards, where required for tax and contractual purposes.",
      "Support correspondence is retained for three years.",
      "Web analytics are retained in aggregate for two years and are not linked to an identified individual.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: [
      "You may request access to, correction of, or deletion of your personal data, and you may object to or restrict certain processing. Where processing is based on consent, you may withdraw it at any time.",
      `To exercise any of these rights, contact ${site.email}. We respond within one month.`,
      "If you are dissatisfied with our response, you may complain to your local data protection authority.",
    ],
  },
  {
    id: "security",
    title: "Security",
    body: [
      "Data in transit is encrypted with TLS. Data at rest in the account portal is encrypted. Access to production systems is restricted to named staff, requires multi-factor authentication, and is logged.",
      "We disclose any personal data breach affecting you without undue delay and, where required, within 72 hours of becoming aware of it.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-white">
        <Container>
          <div className="py-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
          </div>
          <div className="max-w-3xl pb-12">
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tightest text-ink-950">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              How {site.legalName} collects, uses, and protects personal data.
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

              <div className="rounded-xl border border-ink-200 bg-white p-6">
                <p className="text-[0.875rem] leading-relaxed text-ink-600">
                  Questions about this policy can be sent to{" "}
                  <a href={`mailto:${site.email}`} className="font-medium text-brand-600 hover:underline">
                    {site.email}
                  </a>{" "}
                  or by WhatsApp on {site.phoneDisplay}.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
