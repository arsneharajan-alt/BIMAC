"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/common/Logo";
import MegaMenu from "./MegaMenu";
import SoftwareMenu from "./SoftwareMenu";
import MobileNav from "./MobileNav";
import SearchOverlay from "./SearchOverlay";
import EnquiryForm from "@/components/common/EnquiryForm";
import { headerNav, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The two axes into the catalogue; each opens a panel rather than navigating. */
type MenuId = "products" | "software";

/** One row per panel, so the bar and the panels can never fall out of step. */
const menus: { menu: MenuId; label: string; href: string; azure: boolean }[] = [
  { menu: "products", label: "Products", href: "/tools", azure: false },
  { menu: "software", label: "Software", href: "/software", azure: true },
];

export function Header() {
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const megaOpen = openMenu !== null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
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

  // Hovering straight from Products to Software swaps the panel rather than
  // closing and reopening it, so the header never flickers on the way across.
  const openMega = useCallback((menu: MenuId) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  }, []);

  const scheduleCloseMega = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 260);
  }, []);

  // With the scrim inert, something still has to close a menu that was opened
  // by a click. A press anywhere outside the header does it.
  useEffect(() => {
    if (openMenu === null) return undefined;
    const onDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openMenu]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-white/85 backdrop-blur-md transition-all duration-200",
          scrolled || megaOpen ? "border-ink-200" : "border-transparent",
        )}
      >
        <Container>
          <div className="flex h-[4.5rem] items-center gap-4">
            <Logo />

            <nav className="ml-6 hidden items-center lg:flex" aria-label="Primary">
              {/* Two axes, two panels: discipline under Products and host
                  application under Software. Everything else is a plain link. */}
              {menus.map(({ menu, label, href, azure }) => {
                const isOpen = openMenu === menu;
                const lit = isOpen || isActive(href);
                return (
                  <div
                    key={menu}
                    onMouseEnter={() => openMega(menu)}
                    onMouseLeave={scheduleCloseMega}
                    className="relative"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenMenu(isOpen ? null : menu)}
                      aria-expanded={isOpen}
                      className={cn(
                        "flex h-[4.5rem] items-center gap-1.5 px-3.5 text-[0.875rem] font-medium tracking-tight transition-colors",
                        lit
                          ? azure
                            ? "text-azure-600"
                            : "text-brand-600"
                          : "text-ink-700 hover:text-ink-950",
                      )}
                    >
                      {label}
                      <Icon
                        name="chevron-down"
                        className={cn(
                          "text-[0.7rem] transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                      <span
                        className={cn(
                          "absolute inset-x-3 bottom-0 h-0.5 origin-left rounded-full transition-transform duration-200",
                          azure ? "bg-azure-500" : "bg-brand-500",
                          lit ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </button>

                    {/* The panel hangs off the button it belongs to, so the
                        pointer only has to travel straight down into it. */}
                    <div
                      className={cn(
                        "absolute left-0 top-full z-50 origin-top-left transition-all duration-200",
                        isOpen
                          ? "animate-scale-in"
                          : "pointer-events-none invisible -translate-y-1 opacity-0",
                      )}
                    >
                      {menu === "products" ? (
                        <MegaMenu open={isOpen} onNavigate={() => setOpenMenu(null)} />
                      ) : (
                        <SoftwareMenu open={isOpen} onNavigate={() => setOpenMenu(null)} />
                      )}
                    </div>
                  </div>
                );
              })}

              {headerNav
                .filter((link) => !menus.some((item) => item.label === link.label))
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

              {/* No checkout — the primary action is a direct line to BIMAC.
                  Two roads to the same place: the form for someone who wants
                  to leave their details and get on, WhatsApp for someone who
                  would rather just start talking. */}
              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="hidden h-9 items-center gap-2 rounded-lg border-[1.5px] border-brand-500 px-3.5 text-[0.8125rem] font-semibold text-brand-600 transition-colors hover:bg-brand-50 sm:inline-flex"
              >
                <Icon name="mail" className="text-[1.05rem]" />
                Enquire
              </button>

              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden h-9 items-center gap-2 rounded-lg border-[1.5px] border-[#25D366] px-3.5 text-[0.8125rem] font-semibold text-[#128C4A] transition-colors hover:bg-[#25D366]/10 md:inline-flex"
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

      </header>

      {/* Purely a dimmer. It takes no pointer events at all: when it did, the
          strip of it between the bar and the panel closed the menu before
          anyone could reach into it. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 top-[4.5rem] z-40 hidden bg-ink-950/20 backdrop-blur-[1px] transition-opacity duration-200 lg:block",
          megaOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpenSearch={() => setSearchOpen(true)}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <EnquiryForm open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}

export default Header;
