import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/common/Logo";
import { emailLink, footerNav, site, whatsappLink } from "@/lib/site";
import { tools } from "@/data/tools";
import { disciplines } from "@/data/disciplines";

/**
 * The footer, kept short: the mark and one line about us on the left, the
 * link columns level with it on the right, and the legal line underneath.
 *
 * The WhatsApp and Email buttons sit under the last column, Custom
 * Automation, next to About and Contact — the column someone who wants to
 * talk to us is already reading.
 */
export function Footer() {
  const lastColumn = footerNav.length - 1;

  return (
    <footer className="relative overflow-hidden border-t border-ink-800 bg-ink-950 text-ink-300">
      <Container className="relative">
        <div className="grid items-start gap-10 border-b border-white/10 py-10 lg:grid-cols-[18rem_1fr] lg:gap-12">
          <div>
            <Logo onDark />
            <p className="mt-4 max-w-sm text-[0.875rem] leading-relaxed text-ink-400">
              BIM automation tools for architecture, structure and MEPF — built stage by stage,
              from the first site study through to as-built handover.
            </p>
            <p className="mt-3 font-mono text-2xs text-ink-500">
              {tools.length} tools across {disciplines.length} disciplines
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1.5fr)] lg:gap-6">
            {footerNav.map((column, index) => (
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

                {index === lastColumn ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#25D366] px-3.5 text-[0.8125rem] font-medium text-[#0B2E13] transition-colors hover:bg-[#1FBB58]"
                    >
                      <Icon name="whatsapp" className="text-base" />
                      WhatsApp
                    </a>
                    <a
                      href={emailLink()}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 px-3.5 text-[0.8125rem] font-medium text-white transition-colors hover:border-white/35 hover:bg-white/5"
                    >
                      <Icon name="mail" className="text-base" />
                      Email
                    </a>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 py-5 sm:flex-row sm:items-center">
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
