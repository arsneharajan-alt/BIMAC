import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import { LogoMark, Wordmark } from "@/components/common/Logo";
import { emailLink, footerNav, site, whatsappLink } from "@/lib/site";
import { tools } from "@/data/tools";
import { disciplines } from "@/data/disciplines";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink-800 bg-ink-950 text-ink-300">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-dark bg-grid opacity-[0.55] [mask-image:linear-gradient(to_bottom,black,transparent_60%)]"
      />
      <Container className="relative">
        <div className="grid gap-10 border-b border-white/10 py-14 lg:grid-cols-[20rem_1fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="BIMAC — home">
              <LogoMark />
              <Wordmark onDark />
            </Link>
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-ink-400">
              BIM automation tools for architecture, structure and MEPF — built stage by stage,
              from the first site study through to as-built handover.
            </p>
            <p className="mt-4 font-mono text-2xs text-ink-500">
              {tools.length} tools across {disciplines.length} disciplines
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#25D366] px-4 text-[0.8125rem] font-medium text-[#0B2E13] transition-colors hover:bg-[#1FBB58]"
              >
                <Icon name="whatsapp" className="text-base" />
                WhatsApp
              </a>
              <a
                href={emailLink()}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 px-4 text-[0.8125rem] font-medium text-white transition-colors hover:border-white/35 hover:bg-white/5"
              >
                <Icon name="mail" className="text-base" />
                Email
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
            {footerNav.map((column) => (
              <div key={column.title}>
                <p className="mb-4 text-2xs font-semibold uppercase tracking-[0.16em] text-white">
                  {column.title}
                </p>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label + link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.8125rem] leading-5 text-ink-400 transition-colors hover:text-brand-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 border-b border-white/10 py-8 sm:grid-cols-3">
          {[
            {
              glyph: "whatsapp" as const,
              label: "WhatsApp",
              value: site.phoneDisplay,
              href: whatsappLink(),
            },
            { glyph: "mail" as const, label: "Email", value: site.email, href: emailLink() },
            {
              glyph: "clock" as const,
              label: "Response",
              value: "Usually within one working day",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-brand-400">
                <Icon name={item.glyph} className="text-[1rem]" />
              </span>
              <div className="min-w-0">
                <p className="text-2xs uppercase tracking-[0.14em] text-ink-500">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="break-words text-[0.875rem] text-ink-200 transition-colors hover:text-brand-300"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-[0.875rem] text-ink-200">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 py-7 sm:flex-row sm:items-center">
          <p className="text-2xs text-ink-500">
            © {site.founded}–2026 {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy-policy"
              className="text-2xs text-ink-500 transition-colors hover:text-ink-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-2xs text-ink-500 transition-colors hover:text-ink-300"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
