"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/common/Logo";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";
import SearchOverlay from "./SearchOverlay";
import { headerNav, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMegaOpen(false);
      if (event.key === "/" && !searchOpen) {
        const target = event.target as HTMLElement | null;
        const tag = target?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const openMega = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);

  const scheduleCloseMega = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 160);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-white/85 backdrop-blur-md transition-all duration-200",
          scrolled || megaOpen ? "border-ink-200" : "border-transparent",
        )}
      >
        <Container>
          <div className="flex h-[4.5rem] items-center gap-4">
            <Logo />

            <nav className="ml-6 hidden items-center lg:flex" aria-label="Primary">
              <div onMouseEnter={openMega} onMouseLeave={scheduleCloseMega} className="relative">
                <button
                  type="button"
                  onClick={() => setMegaOpen((value) => !value)}
                  aria-expanded={megaOpen}
                  className={cn(
                    "flex h-[4.5rem] items-center gap-1.5 px-3.5 text-[0.875rem] font-medium tracking-tight transition-colors",
                    megaOpen || isActive("/tools")
                      ? "text-brand-600"
                      : "text-ink-700 hover:text-ink-950",
                  )}
                >
                  Tools
                  <Icon
                    name="chevron-down"
                    className={cn(
                      "text-[0.7rem] transition-transform duration-200",
                      megaOpen && "rotate-180",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute inset-x-3 bottom-0 h-0.5 origin-left rounded-full bg-brand-500 transition-transform duration-200",
                      megaOpen || isActive("/tools") ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </button>
              </div>

              {headerNav
                .filter((link) => link.label !== "Tools")
                .map((link) => {
                  // The software axis carries azure wherever it appears.
                  const azure = link.href === "/software";
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={cn(
                        "relative flex h-[4.5rem] items-center px-3.5 text-[0.875rem] font-medium tracking-tight transition-colors",
                        active
                          ? azure
                            ? "text-azure-600"
                            : "text-brand-600"
                          : "text-ink-700 hover:text-ink-950",
                      )}
                    >
                      {link.label}
                      <span
                        className={cn(
                          "absolute inset-x-3 bottom-0 h-0.5 origin-left rounded-full transition-transform duration-200",
                          azure ? "bg-azure-500" : "bg-brand-500",
                          active ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  );
                })}
            </nav>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-950"
              >
                <Icon name="search" className="text-[1.05rem]" />
              </button>

              {/* No checkout — the primary action is a direct line to BIMAC. */}
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden h-9 items-center gap-2 rounded-lg bg-[#25D366] px-3.5 text-[0.8125rem] font-medium text-[#0B2E13] transition-colors hover:bg-[#1FBB58] sm:inline-flex"
              >
                <Icon name="whatsapp" className="text-[1.05rem]" />
                WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
              >
                <Icon name="menu" className="text-[1.15rem]" />
              </button>
            </div>
          </div>
        </Container>

        <div
          onMouseEnter={openMega}
          onMouseLeave={scheduleCloseMega}
          className={cn(
            "absolute inset-x-0 top-full hidden origin-top lg:block",
            megaOpen
              ? "pointer-events-auto animate-scale-in"
              : "pointer-events-none invisible opacity-0",
          )}
        >
          <MegaMenu onNavigate={() => setMegaOpen(false)} />
        </div>
      </header>

      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 hidden bg-ink-950/25 transition-opacity duration-200 lg:block",
          megaOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onMouseEnter={() => setMegaOpen(false)}
      />

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenSearch={() => setSearchOpen(true)}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default Header;
